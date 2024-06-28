import { ForwardedRef, MutableRefObject, forwardRef, useId, useState } from 'react'
import FormInputImage from './FormInputImage';

const FormInput = forwardRef(({ text, isPassword }: {
  text: string,
  isPassword?: boolean
}, ref: ForwardedRef<HTMLInputElement>) => {
  const id = useId();
  const [ isPassVisible, setIsVisible ] = useState(!isPassword);

  function passwordImageClickHandler() {
    if (!isPassword)
      return;

    setIsVisible(prev => !prev);

    (ref as MutableRefObject<HTMLInputElement>).current.type =
      isPassVisible ? "text" : "password";
  }

  return (
    <div className="relative mt-4 form_input">
      <label
        className="absolute bottom-[0.3rem] left-2.5 z-[-1] duration-500"
        htmlFor={id}
      >{text}</label>
      <input
        id={id}
        className="bg-transparent border rounded-3xl border-white p-1 outline-none pl-3 pr-8"
        type={isPassVisible ? "text" : "password"}
        placeholder=" "
        ref={ref}
      />
      <FormInputImage
        type={isPassword ? "password" : "name"}
        isPassVisible={isPassVisible}
        passwordImageClickHandler={passwordImageClickHandler}
      />
    </div>
  )
});

FormInput.displayName = "FormInput"

export default FormInput;