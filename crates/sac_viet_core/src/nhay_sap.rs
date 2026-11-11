//! Nhảy Sạp rhythm & sequence game engine
//!
//! Rules:
//! - Arrow button sequence strictly capped at 3 buttons max (no unbounded sequence)
//! - Endless progression with increasing BPM and tighter hit windows
//! - Timing judgment: Perfect, Good, Miss

pub const MAX_SEQUENCE_LENGTH: usize = 3;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Direction {
    Left = 0,
    Right = 1,
    Up = 2,
    Down = 3,
}

impl Direction {
    pub fn from_u8(val: u8) -> Self {
        match val % 4 {
            0 => Direction::Left,
            1 => Direction::Right,
            2 => Direction::Up,
            _ => Direction::Down,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum JudgeQuality {
    Perfect,
    Good,
    Miss,
    Ignored,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum InputResult {
    Correct,
    Ready,
    Wrong,
    Ignored,
}

#[derive(Debug, Clone, PartialEq)]
pub struct RoundConfig {
    pub round: u32,
    pub length: usize, // Strictly <= 3 (capped at 3 max)
    pub seconds_per_key: f32,
    pub settle: f32,
    pub duration: f32,
    pub good: f32,
    pub perfect: f32,
    pub bpm: f32,
}

impl RoundConfig {
    pub fn for_round(round: u32) -> Self {
        let progress = (round.saturating_sub(1)) as f32;
        // Capped strictly at 3 arrows max
        let length = MAX_SEQUENCE_LENGTH;
        let seconds_per_key = (0.38 - progress * 0.005).max(0.20);
        let settle = (0.65 - progress * 0.004).max(0.40);
        let duration = (length as f32) * seconds_per_key + settle;
        let good = (0.20 - progress * 0.004).max(0.075);
        let perfect = (0.085 - progress * 0.0015).max(0.035);
        let bpm = (90.0 + progress * 2.0).min(160.0);

        Self {
            round,
            length,
            seconds_per_key,
            settle,
            duration,
            good,
            perfect,
            bpm,
        }
    }
}

#[derive(Debug, Clone)]
pub struct SapRoundState {
    pub config: RoundConfig,
    pub sequence: Vec<Direction>,
    pub index: usize,
    pub start_time: f32,
    pub target_time: f32,
    pub resolved: bool,
    pub result: Option<JudgeQuality>,
}

impl SapRoundState {
    pub fn new(round: u32, start_time: f32, seed_values: &[u8]) -> Self {
        let config = RoundConfig::for_round(round);
        let mut sequence = Vec::with_capacity(config.length);
        for i in 0..config.length {
            let val = seed_values.get(i).copied().unwrap_or((i % 4) as u8);
            sequence.push(Direction::from_u8(val));
        }

        let target_time = start_time + config.duration;
        Self {
            config,
            sequence,
            index: 0,
            start_time,
            target_time,
            resolved: false,
            result: None,
        }
    }

    pub fn handle_input(&mut self, dir: Direction) -> InputResult {
        if self.resolved {
            return InputResult::Ignored;
        }
        if self.index >= self.sequence.len() {
            return InputResult::Ready;
        }

        if dir == self.sequence[self.index] {
            self.index += 1;
            if self.index >= self.sequence.len() {
                InputResult::Ready
            } else {
                InputResult::Correct
            }
        } else {
            self.index = 0; // Wrong key resets current phrase index
            InputResult::Wrong
        }
    }

    pub fn commit(&mut self, current_time: f32) -> JudgeQuality {
        if self.resolved {
            return JudgeQuality::Ignored;
        }
        self.resolved = true;

        let delta = (current_time - self.target_time).abs();
        let res = if self.index < self.sequence.len() || delta > self.config.good {
            JudgeQuality::Miss
        } else if delta <= self.config.perfect {
            JudgeQuality::Perfect
        } else {
            JudgeQuality::Good
        };

        self.result = Some(res);
        res
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_sequence_length_never_exceeds_three() {
        for round in 1..=1000 {
            let cfg = RoundConfig::for_round(round);
            assert!(cfg.length <= 3, "Round {} length was {}", round, cfg.length);
            assert_eq!(cfg.length, 3);
        }
    }

    #[test]
    fn test_sap_input_flow() {
        let mut round = SapRoundState::new(1, 0.0, &[0, 1, 2]);
        assert_eq!(round.sequence.len(), 3);

        // First key
        assert_eq!(round.handle_input(Direction::Left), InputResult::Correct);
        // Wrong key resets
        assert_eq!(round.handle_input(Direction::Down), InputResult::Wrong);
        assert_eq!(round.index, 0);

        // Correct sequence
        assert_eq!(round.handle_input(Direction::Left), InputResult::Correct);
        assert_eq!(round.handle_input(Direction::Right), InputResult::Correct);
        assert_eq!(round.handle_input(Direction::Up), InputResult::Ready);

        // Commit Space at target time -> Perfect
        let target = round.target_time;
        assert_eq!(round.commit(target), JudgeQuality::Perfect);
    }
}
