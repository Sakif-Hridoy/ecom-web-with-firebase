import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { UserContext } from '../../App';
import './Shipment.css';

const Shipment = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const onSubmit = data => console.log("form submitted",data);
    const [loggedInUser,setLoggedInUser] = useContext(UserContext);
    console.log(watch("example")); // watch input value by passing the name of it
  
    return (
      /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
      <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="shipment-text">This Is Your Shipment Page</h1>
          <br />
        {/* register your input into the hook by invoking the "register" function */}
        
        {/* include validation with required or other standard HTML validation rules */}
        <input defaultValue={loggedInUser.name}{...register("name", { required: true })} placeholder="Your Name"/>
        {/* errors will return when field validation fails  */}
        {errors.name && <span className="error">Name is required</span>}

        <input defaultValue={loggedInUser.email}{...register("email", { required: true })} placeholder="Your Email"/>
        {/* errors will return when field validation fails  */}
        {errors.email && <span className="error">Email is required</span>}

        <input {...register("address", { required: true })} placeholder="Your Home Address"/>
        {/* errors will return when field validation fails  */}
        {errors.address && <span className="error">Address is required</span>}

        <input {...register("phone", { required: true })} placeholder="Your Phone Number"/>
        {/* errors will return when field validation fails  */}
        {errors.phone && <span className="error">Phone Number is required</span>}
        
        <input type="submit" />
      </form>
    );
};

export default Shipment;