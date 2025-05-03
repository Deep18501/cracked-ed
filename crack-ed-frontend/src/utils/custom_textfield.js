
import React from 'react';
import '../styles/customtextfield.css';
import { useState } from 'react';

const CustomTextField = ({ label, type, name, onChange ,tail,tailContent }) => {

    const [value, setValue] = useState('');


    
    const handleChange = (e) => {
        const newValue = e.target.value;
        setValue(newValue);
        if (onChange) onChange(name, newValue); 
    };

    return (
        <div className="custom-text-field">
            <input type={type} name={name}
                value={value}
                onChange={handleChange}
                required />
            <span className={`placeholder ${value ? 'filled' : ''}`}>
            {!value?label:""}
            </span>
            {tail ? <div className='tail'>{tailContent}</div> : null}
        </div>
    );
};

export default CustomTextField;
