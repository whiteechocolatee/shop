import { fetchingData } from "../fetch";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        0: { id: 1, category: "Для него" },
        1: { id: 2, category: "Для неё" },
      }),
  })
);

it("fetching correctly", async () => {
  const fetchedData = await fetchingData("/main/categories", { method: "GET" });

  expect(fetchedData).toEqual({
    "0": { category: "Для него", id: 1 },
    "1": { category: "Для неё", id: 2 },
  });
  expect(fetch).toHaveBeenCalledTimes(1);
});

it("handles errors with null", async () => {
  fetch.mockImplementationOnce(() => Promise.reject("API FAILURE"));

  const fetchedData = await fetchingData('"/main/categories"', {
    method: "GET",
  });

  expect(fetchedData).toEqual(null);
});
