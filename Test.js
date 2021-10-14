const fnc1 = () => {
  return new Promise((ok) => {
    ok("Promise1");
  });
};

const fnc2 = () => {
  return fnc1();
};

const func = async () => {
  const res = await fnc2();
  console.log(res);
};

func();
