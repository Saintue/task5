import "./App.css";
import { useState } from "react";
import { useEffect } from "react";
import { Posts } from "./posts";
let page = 1;
let locale = "en";
let seed = 0;
let mistakes = 0;
let initUsers = await Posts.getUsers({
  seed: seed,
  amount: 20,
  mistakes: 0,
  locale: "en",
  page: page,
});

function App() {
  const [userArr, setUserArr] = useState(initUsers);
  const [sliderValue, setSliderValue] = useState(0);
  const [mistakeValue, setMistakeValue] = useState(0);
  const [seedValue, setSeedValue] = useState(seed);
  useEffect(() => {
    const getData = setTimeout(() => {
      updateData({ mistakes: mistakeValue });
    }, 1000);
    return () => clearTimeout(getData);
  }, [mistakeValue]);
  useEffect(() => {
    const getData = setTimeout(() => {
      updateData({ seed: seed });
    }, 1000);
    return () => clearTimeout(getData);
  }, [seedValue]);

  async function loadMore() {
    page += 1;
    let newUsers = await Posts.getUsers({
      seed: seed,
      amount: 10,
      mistakes: mistakes,
      locale: locale,
      page: page,
    });
    setUserArr([...userArr, ...newUsers]);
  }
  async function updateData(value) {
    page = 1;
    if (value.region !== undefined) locale = value.region;
    if (value.mistakes !== undefined) mistakes = value.mistakes;
    if (value.seed !== undefined) seed = value.seed;
    let newUsers = await Posts.getUsers({
      seed: seed,
      amount: 20,
      mistakes: mistakes,
      locale: locale,
      page: page,
    });
    setUserArr([...newUsers]);
  }
  function changeMistakes(e) {
    setSliderValue(+e.target.value);
    setMistakeValue((+e.target.value * 100).toFixed(0));
  }
  function changeSlider(e) {
    let input = e.target.value;
    if (input.match(/^([0-9]{1,})?(\.)?([0-9]{1,})?$/)) {
      if (input > 1000) input = 1000;
      setSliderValue(input / 100);
      setMistakeValue(input);
    }
  }

  function handleSeedInput(e) {
    let input = e.target.value;
    if (input.match(/^(\s*|\d+)$/)) {
      seed = +input;
      setSeedValue(input);
    }
  }

  function genRandomSeed() {
    seed = Math.floor(Math.random() * 1000000);
    setSeedValue(seed);
  }

  return (
    <div className="App">
      <header className="App-header d-flex justify-content-center mt-3">
        <div
          className={"container justify-content-between align-content-center"}
        >
          <div>
            Region:
            <select onChange={(e) => updateData({ region: e.target.value })}>
              <option value="en">EN</option>
              <option value="ru">RU</option>
              <option value="pl">PL</option>
            </select>
          </div>
          <div className={" d-flex align-content-center"}>
            errors:
            <input
              type={"range"}
              value={sliderValue}
              max={10}
              min={0}
              step={0.1}
              onChange={(e) => changeMistakes(e)}
            />
            <input
              value={mistakeValue}
              type={"number"}
              onChange={(e) => changeSlider(e)}
            />
          </div>
          <div className={" d-flex align-content-center"}>
            Seed:{" "}
            <input value={seedValue} onChange={(e) => handleSeedInput(e)} />
            <button onClick={() => genRandomSeed()}>Randomize</button>
          </div>
        </div>
      </header>
      <body className={"d-flex mt-5"}>
        <div className={"d-flex flex-column justify-content-center container"}>
          <table>
            <thead>
              <tr>
                <th>index</th>
                <th>id</th>
                <th>name</th>
                <th>Adress</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {userArr.map((user, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.adres}</td>
                  <td>{user.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => loadMore(page)}>Load More</button>
        </div>
      </body>
    </div>
  );
}

export default App;
