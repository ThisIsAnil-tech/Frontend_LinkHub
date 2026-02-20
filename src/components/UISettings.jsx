import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import "../styles/form.css";

const UISettings = () => {
  const {
    accent, setAccent,
    font, setFont,
    gradient, setGradient
  } = useContext(ThemeContext);

  return (
    <div className="link-form">
      <h3>UI Customization</h3>
      <label>Accent Color</label>
      <input
        type="color"
        value={accent}
        onChange={(e) => setAccent(e.target.value)}
      />
      <label>Font</label>
      <select value={font} onChange={(e) => setFont(e.target.value)}>
        <option value="Inter">Inter</option>
        <option value="Poppins">Poppins</option>
        <option value="Roboto">Roboto</option>
        <option value="Montserrat">Montserrat</option>
      </select>
      <label>Background Style</label>
      <select value={gradient} onChange={(e) => setGradient(e.target.value)}>
        <option value="default">Soft Blue</option>
        <option value="sunset">Sunset</option>
        <option value="night">Dark Ocean</option>
        <option value="mint">Mint</option>
      </select>
    </div>
  );
};

export default UISettings;