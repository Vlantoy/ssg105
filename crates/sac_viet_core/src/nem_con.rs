//! Ném Còn game physics & match rules engine
//!
//! Rules:
//! - Winning score is strictly 3 points (modified per user request from 10 points)
//! - Physical projectile simulation with calibrated drag and gravity
//! - Ring ellipse pass-through geometry detection

pub const WINNING_SCORE: i32 = 3;
pub const GRAVITY: f32 = 380.0;
pub const AIR_DRAG: f32 = 0.00006;
pub const RING_CENTER_X: f32 = 1476.0;
pub const RING_CENTER_Y: f32 = 194.2;
pub const RING_INNER_RX: f32 = 9.0;
pub const RING_INNER_RY: f32 = 38.0;

#[derive(Debug, Clone, Copy, PartialEq)]
pub struct ProjectileState {
    pub x: f32,
    pub y: f32,
    pub vx: f32,
    pub vy: f32,
    pub scored: bool,
    pub landed: bool,
}

impl ProjectileState {
    pub fn new(x: f32, y: f32, vx: f32, vy: f32) -> Self {
        Self {
            x,
            y,
            vx,
            vy,
            scored: false,
            landed: false,
        }
    }

    /// Step simulation with aerodynamic drag and gravity
    pub fn step(&mut self, dt: f32, wind_x: f32, ground_y: f32) {
        if self.landed {
            return;
        }

        let rel_vx = self.vx - wind_x;
        let speed = (rel_vx * rel_vx + self.vy * self.vy).sqrt();
        let drag_force = AIR_DRAG * speed * speed;

        let drag_ax = if speed > 1e-4 { -drag_force * (rel_vx / speed) } else { 0.0 };
        let drag_ay = if speed > 1e-4 { -drag_force * (self.vy / speed) } else { 0.0 };

        self.vx += drag_ax * dt;
        self.vy += (GRAVITY + drag_ay) * dt;

        self.x += self.vx * dt;
        self.y += self.vy * dt;

        // Check ellipse ring score
        if !self.scored {
            let dx = (self.x - RING_CENTER_X) / RING_INNER_RX;
            let dy = (self.y - RING_CENTER_Y) / RING_INNER_RY;
            if dx * dx + dy * dy <= 1.0 {
                self.scored = true;
            }
        }

        // Ground contact
        if self.y >= ground_y {
            self.y = ground_y;
            self.vx = 0.0;
            self.vy = 0.0;
            self.landed = true;
        }
    }
}

/// Versus match score tracking with 3-point victory condition
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct NemConMatch {
    pub p1_score: i32,
    pub p2_score: i32,
    pub target_score: i32,
    pub winner: Option<i32>,
}

impl Default for NemConMatch {
    fn default() -> Self {
        Self::new()
    }
}

impl NemConMatch {
    pub fn new() -> Self {
        Self {
            p1_score: 0,
            p2_score: 0,
            target_score: WINNING_SCORE, // 3 points
            winner: None,
        }
    }

    /// Award points and check victory immediately
    pub fn record_point(&mut self, player: i32, points: i32) -> Option<i32> {
        if self.winner.is_some() {
            return self.winner;
        }

        if player == 1 {
            self.p1_score += points;
            if self.p1_score >= self.target_score {
                self.winner = Some(1);
            }
        } else if player == 2 {
            self.p2_score += points;
            if self.p2_score >= self.target_score {
                self.winner = Some(2);
            }
        }

        self.winner
    }

    pub fn is_over(&self) -> bool {
        self.winner.is_some()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_winning_score_is_three() {
        assert_eq!(WINNING_SCORE, 3);
        let mut game = NemConMatch::new();
        assert_eq!(game.target_score, 3);

        // Score 1 point -> no winner
        assert_eq!(game.record_point(1, 1), None);
        assert!(!game.is_over());

        // Score 2nd point -> no winner
        assert_eq!(game.record_point(1, 1), None);
        assert!(!game.is_over());

        // Score 3rd point -> P1 wins!
        assert_eq!(game.record_point(1, 1), Some(1));
        assert!(game.is_over());
        assert_eq!(game.winner, Some(1));
    }

    #[test]
    fn test_projectile_ring_scoring() {
        let mut proj = ProjectileState::new(RING_CENTER_X, RING_CENTER_Y, 0.0, 0.0);
        proj.step(0.001, 0.0, 800.0);
        assert!(proj.scored);
    }
}
