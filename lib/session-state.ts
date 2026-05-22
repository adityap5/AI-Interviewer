export type SessionState = "idle" | "briefing" | "questioning" | "evaluating" | "complete";

export class SessionStateMachine {
  private state: SessionState;

  constructor(initialState: SessionState = "idle") {
    this.state = initialState;
  }

  public get currentState(): SessionState {
    return this.state;
  }

  /**
   * Validates if state transition is allowed
   */
  public canTransition(nextState: SessionState): boolean {
    switch (this.state) {
      case "idle":
        return nextState === "briefing";
      case "briefing":
        return nextState === "questioning";
      case "questioning":
        return nextState === "evaluating";
      case "evaluating":
        return nextState === "questioning" || nextState === "complete";
      case "complete":
        return false; // Terminal state
      default:
        return false;
    }
  }

  /**
   * Performs transition to next state if valid, throws error otherwise
   */
  public transition(nextState: SessionState): SessionState {
    if (this.canTransition(nextState)) {
      this.state = nextState;
      return this.state;
    }
    throw new Error(`Invalid state transition from ${this.state} to ${nextState}`);
  }

  public isComplete(): boolean {
    return this.state === "complete";
  }
}
