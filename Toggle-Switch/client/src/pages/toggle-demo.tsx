import React, { useState } from 'react';
import './toggle-demo.css';

export default function ToggleDemo() {
  const [isNight, setIsNight] = useState(false);

  const toggleSwitch = () => {
    setIsNight(!isNight);
  };

  return (
    <div className="demo-container">
      <div 
        className={`toggle-switch ${isNight ? 'night' : 'day'}`} 
        onClick={toggleSwitch} 
        data-testid="toggle-switch"
      >
        <div className="toggle-background">
          {/* Day Scenery */}
          <div className="scenery day-scenery">
            <div className="cloud cloud-1"></div>
            <div className="cloud cloud-2"></div>
            <div className="cloud cloud-3"></div>
            <div className="cloud cloud-4"></div>
            <div className="cloud cloud-5"></div>
          </div>
          
          {/* Night Scenery */}
          <div className="scenery night-scenery">
            <div className="star star-1">✦</div>
            <div className="star star-2">★</div>
            <div className="star star-3">✦</div>
            <div className="star star-4">.</div>
            <div className="star star-5">.</div>
            <div className="star star-6">.</div>
          </div>
        </div>

        <div className="toggle-knob">
          <div className="crater crater-1"></div>
          <div className="crater crater-2"></div>
          <div className="crater crater-3"></div>
        </div>
      </div>
    </div>
  );
}
