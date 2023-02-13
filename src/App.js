import SolowModel from "./library/SolowModel";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Label,
} from "recharts";
import { useState, useEffect } from "react";

function App() {
  const [inputs, setInputs] = useState({ delta: null, s_rate: null });
  const [model, setModel] = useState(null);

  useEffect(() => {
    if (inputs.delta && inputs.s_rate) {
      console.log(inputs);
      const p = new SolowModel(
        1,
        1 / 3,
        10,
        100,
        Number(inputs.delta),
        Number(inputs.s_rate)
      );
      p.nextPoint(50);
      console.log(p);
      setModel(p);
    }
  }, [inputs]);

  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    // console.log(formJson);
    setInputs(formJson);
  }

  // tfp, alpha, k_zero, labor, delta, savings
  useEffect(() => {
    const p = new SolowModel(1, 1 / 3, 10, 100, 0.1, 0.1);
    p.nextPoint(25);
    // p.changeTFP(2);
    p.nextPoint(24);
    console.log(p);
    setModel(p);
  }, []);

  return (
    <div className="App">
      {model ? (
        <LineChart
          width={800}
          height={400}
          data={model.out_series}
          margin={{ bottom: 50 }}
        >
          <CartesianGrid />
          <XAxis dataKey="0" type="number" name="t">
            <Label value="t" offset={30} position="bottom" />
          </XAxis>
          <YAxis
            type="number"
            domain={[
              0,
              // (dataMax) => Math.ceil(dataMax) + Math.ceil(dataMax) * 0.1,
              5,
            ]}
          />
          <Tooltip />
          <Legend />
          <Line
            name="y"
            dot={false}
            type="monotone"
            dataKey="2"
            stroke="#f22"
            strokeWidth={2}
          />
          <Line
            name="k"
            dot={false}
            type="monotone"
            dataKey="4"
            stroke="#8884d8"
            strokeWidth={2}
          />
          <Line
            name="y*"
            dot={false}
            type="linear"
            dataKey="9"
            stroke="#434343"
            strokeWidth={1}
          />
          <Line
            name="k*"
            dot={false}
            type="linear"
            dataKey="10"
            stroke="#434343"
            strokeWidth={1}
          />
        </LineChart>
      ) : (
        <div />
      )}
      <form method="post" onSubmit={handleSubmit}>
        <label for="delta-input">&delta; (Depreciation Rate): </label>
        <input
          type="text"
          id="delta-input"
          name="delta"
          defaultValue={0.1}
          placeholder="delta"
        />
        <br />
        <label for="savings-rate-input">s (Savings Rate): </label>
        <input
          type="text"
          id="savings-rate-input"
          name="s_rate"
          defaultValue={0.1}
          placeholder="savings rate"
        />
        <br />
        <button type="submit">Graph</button>
      </form>
    </div>
  );
}

export default App;
