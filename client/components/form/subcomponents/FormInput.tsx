import { useId, useState } from 'react';
import FormInputImage from '@components/FormInputImage';

export default function FormInput({
  text,
  changeText,
  isPassword
}: {
  text: string,
  changeText: (newText: string) => void,
  isPassword?: boolean
}) {
  const id = useId();
  const [ isPassVisible, setIsPassVisible ] = useState(!isPassword);

  function passwordImageClickHandler() {
    if (!isPassword)
      return;

    setIsPassVisible(prev => !prev);
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
        value={text}
        onChange={e => changeText(e.target.value)}
      />
      <FormInputImage
        type={isPassword ? "password" : "name"}
        isPassVisible={isPassVisible}
        passwordImageClickHandler={passwordImageClickHandler}
      />
    </div>
  )
}