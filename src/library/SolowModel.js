class SolowModel {
  constructor(tfp, alpha, capital, labor, delta, savings) {
    this.t = 0;

    this.in_series = []; // series of parameters (listed above) from t=0
    this.out_series = []; // series of endogenous variables from t=0

    console.log(savings);
    this.in_series.push([this.t, tfp, alpha, capital, labor, delta, savings]);
    this.out_series.push([
      this.t,
      ...this.solve(this.in_series[this.t].slice(1)),
    ]);
  }

  solve(inputs) {
    let out = [];

    out.push(inputs[0] * inputs[2] ** inputs[1] * inputs[3] ** (1 - inputs[1])); // output = AK**(alpha)L**(1-alpha)
    out.push(out[0] / inputs[3]); // output per capita

    out.push(inputs[2]); // capital = capital
    out.push(out[2] / inputs[3]); // capital per capita

    out.push(inputs[5] * out[0]); // investment = s * output
    out.push(out[4] / inputs[3]); // investment per capita

    out.push(out[0] - out[4]); // consumption = output - investment
    out.push(out[6] / inputs[3]); // consumption per capita

    out.push(
      inputs[0] ** (1 / (1 - inputs[1])) *
        (inputs[5] / inputs[4]) ** (inputs[1] / (1 - inputs[1]))
    ); // steady state output per capita
    out.push(((inputs[5] * inputs[0]) / inputs[4]) ** (1 / (1 - inputs[1]))); // steady state capital per capita

    return out;
  }

  nextPoint(n) {
    for (let i = 0; i < n; i++) {
      let next_input = this.in_series[this.t].slice(1);
      let prev_output = this.out_series[this.t].slice(1);
      next_input[2] = prev_output[4] + next_input[2] * (1 - next_input[4]); // K_t+1 = I_t + K_t(1 - delta);
      this.t++;
      this.in_series.push([this.t, ...next_input]);
      this.out_series.push([this.t, ...this.solve(next_input)]);
    }
  }
  changeTFP(n) {
    let next_input = this.in_series[this.t].slice(1);
    let prev_output = this.out_series[this.t].slice(1);
    next_input[2] = prev_output[4] + next_input[2] * (1 - next_input[4]); // K_t+1 = I_t + K_t(1 - delta);
    next_input[0] = next_input[0] * n;
    this.t++;
    this.in_series.push([this.t, ...next_input]);
    this.out_series.push([this.t, ...this.solve(next_input)]);
  }
  changeSavings(n) {
    let next_input = this.in_series[this.t].slice(1);
    let prev_output = this.out_series[this.t].slice(1);
    next_input[2] = prev_output[4] + next_input[2] * (1 - next_input[4]); // K_t+1 = I_t + K_t(1 - delta);
    next_input[5] = next_input[5] * n;
    this.t++;
    this.in_series.push([this.t, ...next_input]);
    this.out_series.push([this.t, ...this.solve(next_input)]);
  }
}

export default SolowModel;
