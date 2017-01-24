import React from 'react';

class InputField extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className={"input-field col " + this.props.responsive}>
        <input placeholder={this.props.placeholder} id={this.props.id} type="text" className={this.props.classNames} data-label={this.props.label}></input>
        <label htmlFor={this.props.htmlFor}>{this.props.label}</label>
      </div>
    );
  }
}

export default InputField;
