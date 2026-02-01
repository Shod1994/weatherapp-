# API Fetch Pattern (React + Axios)

Use this pattern for any API request in a React app.
If something breaks, check each section in order.

---

## 1. Required State

Every fetch needs all three:

```js
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

function handleSubmit(e) {
  e.preventDefault();

  setLoading(true);
  setError("");
  setData(null);

  // axios call here
}

axios
  .get(URL)
  .then(function (response) {
    // Validate response before using it
    if (!response.data || response.data.length === 0) {
      throw new Error("Not found");
    }

    return response.data;
  })
  .then(function (cleanData) {
    setData(cleanData);
  })
  .catch(function (error) {
    var message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      "Something went wrong.";

    setError(message);
  })
  .finally(function () {
    setLoading(false);
  });

{
  loading && <p>Loading...</p>;
}
{
  error && <p className="error">{error}</p>;
}
{
  data && <Component data={data} />;
}
```
