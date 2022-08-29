import React from "react";
import { Link } from "react-router-dom";

function OtherPage() {
  return (
    <div>
      I'm some other page!
      <Link to="/">Go back to Homepage</Link>
    </div>
  );
}

export default OtherPage;
