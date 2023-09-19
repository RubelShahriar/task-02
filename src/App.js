import { useState } from "react";
import "./App.css";
import initalData from "./InitialData";
import EmojiCursor from "./Cursor";

function App() {
  const [isOn, setIsOn] = useState(false);
  const [userData, setUserData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    textarea: initalData,
    checkbox: false,
  });
  const [errors, setErrors] = useState({
    name: "",
    textarea: "",
    checkbox: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Perform validation based on input type
    const validationErrors = { ...errors };

    switch (name) {
      case "name":
        validationErrors.name =
          value.length < 3 || value.length > 20
            ? "⚠️ Name must be between 3 and 20 characters"
            : value.trim() !== value
            ? "⚠️ Name cannot have leading or trailing spaces."
            : !/^[a-zA-Z-' ]+$/.test(value)
            ? "⚠️ Name can only contain letters, spaces, hyphens, and apostrophes."
            : "";
        break;
      case "textarea":
        validationErrors.textarea =
          value.length < 5
            ? "⚠️ Value must be more than 5 characters"
            : !value.trim()
            ? "⚠️ Textarea cannot be empty."
            : !/.+\n.+/s.test(value)
            ? "⚠️ Enter atleast 2 sector"
            : "";
        break;
      case "checkbox":
        validationErrors.checkbox = !checked
          ? "⚠️ You must accept the terms and conditions"
          : "";
        break;
      default:
        break;
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setErrors(validationErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if there are any validation errors
    const { name, textarea, checkbox } = formData;
    if (
      !name ||
      !textarea ||
      !checkbox ||
      Object.values(errors).some((error) => error !== "")
    ) {
      alert("Please fill in all required fields correctly.");
      return;
    }

    // Send formData to a backend server (e.g., Express.js) and store it in MongoDB
    try {
      await fetch("http://localhost:4000/insert-and-return", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then((data) => {
          setUserData(data); // Update the state with the newly added item
        })
        .catch((error) => console.error("Error:", error));

      // alert a response
      alert("Data stored successfully");

      // update the state values from database
      setFormData({
        name: userData.name,
        textarea: userData.textarea,
        checkbox: userData.checkbox,
      });
    } catch (error) {
      console.error("Error storing data:", error);
    }
    console.log(errors);
  };

  const handleToggleClick = () => {
    setIsOn(!isOn);
  };

  return (
    <>
      <div className="App">
        <h1>
          Please enter your name and edit the sectors you are currently involved
          in.
        </h1>
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <div className="error">{errors.name}</div>
          <br />
          <label>Sectors:</label>
          <textarea
            name="textarea"
            rows={20}
            value={formData.textarea}
            onChange={handleChange}
            required
          />
          <div className="error">{errors.textarea}</div>
          <br />
          {userData.checkbox ? (
            <input
              type="checkbox"
              name="checkbox"
              checked={formData.checkbox}
              onChange={handleChange}
              required
            />
          ) : (
            <input
              type="checkbox"
              name="checkbox"
              checked={userData.checkbox}
              onChange={handleChange}
              required
            />
          )}{" "}
          Agree to terms
          <div className="error">{errors.checkbox}</div>
          <br />
          <button type="submit">Save</button>
        </form>
      </div>
      {isOn ? (
        <button className="curBtn" onClick={handleToggleClick}>
          Turn Off Emoji Cursor
        </button>
      ) : (
        <button className="curBtn" onClick={handleToggleClick}>
          Turn On Emoji Cursor
        </button>
      )}
      {isOn && <EmojiCursor></EmojiCursor>}
    </>
  );
}

export default App;
