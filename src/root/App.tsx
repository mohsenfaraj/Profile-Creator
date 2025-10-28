import React, { useMemo, useRef, useState, useEffect } from "react";
import { Panel } from "../ui/Panel";
import { Preview } from "../ui/Preview";
import { defaultState, ProfileState } from "../state";

export function App() {
  const [state, setState] = useState<ProfileState>(defaultState());

  const handleReset = () => setState(defaultState());

  return (
    <div className="shell">
      <Panel state={state} setState={setState} onReset={handleReset} />
      <Preview state={state} />
    </div>
  );
}
