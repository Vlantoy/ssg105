//! # Sắc Việt Core - High-Performance Game Logic
//!
//! Provides the optimized game math and rules engine for:
//! 1. `nem_con`: 3-point victory match rules, centrifugal force, aerodynamic drag, ring collision
//! 2. `nhay_sap`: Rhythm progression, timing window judgment, 3-arrow max limit

pub mod nem_con;
pub mod nhay_sap;

pub use nem_con::{NemConMatch, ProjectileState, WINNING_SCORE};
pub use nhay_sap::{Direction, InputResult, JudgeQuality, RoundConfig, SapRoundState, MAX_SEQUENCE_LENGTH};

#[cfg(feature = "wasm")]
use wasm_bindgen::prelude::*;

#[cfg(feature = "wasm")]
#[wasm_bindgen]
pub fn nem_con_winning_score() -> i32 {
    WINNING_SCORE
}

#[cfg(feature = "wasm")]
#[wasm_bindgen]
pub fn nhay_sap_max_sequence_length() -> usize {
    MAX_SEQUENCE_LENGTH
}
