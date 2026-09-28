import React, { useCallback, useContext, useEffect, useState } from 'react'
import Card from "react-bootstrap/Card"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Select from 'react-select';
import Spiner from "../../components/Spiner/Spiner";
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./edit.css"
import { useNavigate, useParams } from 'react-router-dom';
import { singleUsergetfunc, editfunc } from '../../services/Apis';
import { BASE_URL } from '../../services/helper';
import { updateData } from '../../components/context/ContextProvider';



const Edit = () => {

        const [inputdata, setInputData] = useState({
            fname :"",
            lname :"",
            email:"",
            mobile:"",
            gender:"",
            location:""
        });
    
        const [status, setStatus] = useState("Active");
        const [imgdata, setImgdata] = useState("")
        const [image, setImage] = useState("");
        const [preview, setPreview] = useState("");

        const {setUpdate} = useContext(updateData);

        const navigate = useNavigate();

        const [showspin, setShowSpin]= useState(true)

        const {id} = useParams();
    
        // status options
        const options = [
            { value: 'Active', label: 'Active' },
            { value: 'InActive', label: 'InActive' }
          ];
    
        // set Input value
        const setInputValue = (e)=>{
            const {name, value} = e.target;
            setInputData({...inputdata,[name]:value})
        }
    
        // satus set
        const setStatusValue = (e)=>{
            setStatus(e.value)
        }
    
        // profile set
        const setProfile = (e)=>{
            setImage(e.target.files[0])
        }


        const userProfileGet = useCallback(async()=>{
            const response = await singleUsergetfunc(id);
        
            if(response.status === 200){
              setInputData(response.data);
              setStatus(response.data.status);
              setImgdata(response.data.profile)
            }else{
              console.log("error");
            }
            
          }, [id]);
    
        // submit userdata
        const submitUserData = async (e)=>{
            e.preventDefault();
    
            const {fname, lname, email, mobile, gender, location} = inputdata;
    
            if(fname === ""){
                toast.error("First name is Required !")
            }
            else if(lname === ""){
                toast.error("Last name is Required !")
            }
            else if(email === ""){
                toast.error("Email is Required !")
            }
            else if(!email.includes("@")){
                toast.error("Enter Valid Email !")
            }
            else if(mobile === ""){
                toast.error("Mobile no is Required !")
            }
            else if(mobile.length > 10){
                toast.error("Enter valid mobile no !")
            }
            else if(gender === ""){
                toast.error("Gender is Required !")
            }
            else if(status === ""){
                toast.error("Status is Required !")
            }
            else if(location === ""){
                toast.error("Location is Required !")
            }
            else{
                            
            const data = new FormData();
            data.append("fname",fname)
            data.append("lname",lname)
            data.append("email",email)
            data.append("mobile",mobile)
            data.append("gender",gender)
            data.append("status",status)
            data.append("user_profile",image || imgdata)
            data.append("location",location)

            const config = {
                "Content-Type":"multipart/form-data"
            }

            const response = await editfunc(id,data,config)
                
                if(response.status === 200){
                    setUpdate(response.data)
                    navigate("/")
                }
            }
        }

        useEffect(()=>{
            userProfileGet();
        },[userProfileGet])
    
        useEffect(()=>{
            if(image){
                setImgdata("")
                setPreview(URL.createObjectURL(image))
            }
            setTimeout(()=>{
                setShowSpin(false)
              }, 1200)
        },[image])

  return (
    <>
    {
        showspin ? <Spiner /> : 
        <div className="container">
                <h2 className='text-center mt-1'>Update Your Details</h2>
                <Card className='shadow mt-3 p-3'>
                    <div className="profile_div text-center">
                        <img src={image ? preview : `${BASE_URL}/uploads/${imgdata}`} alt="" />
                    </div>

                    <Form>
                        <Row>
                            <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control type="text" placeholder="First Name" name='fname' value={inputdata.fname} onChange={setInputValue} />
                            </Form.Group>
                            <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control type="text" placeholder="Last Name" name='lname' value={inputdata.lname} onChange={setInputValue} />
                            </Form.Group>
                            <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" name='email' value={inputdata.email} onChange={setInputValue} />
                            </Form.Group>
                            <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                                <Form.Label>Mobile</Form.Label>
                                <Form.Control type="text" placeholder="Enter mobile no" name='mobile' value={inputdata.mobile} onChange={setInputValue} />
                            </Form.Group>
                            <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                                <Form.Label>Select Your Gender</Form.Label>
                                <Form.Check
                                    type={"radio"}
                                    label={`Male`}
                                    name='gender'
                                    value={"Male"}
                                    checked={inputdata.gender === "Male" ? true:false}
                                    onChange={setInputValue}

                                />
                                <Form.Check
                                    type={"radio"}
                                    label={`Female`}
                                    name='gender'
                                    value={"Female"}
                                    checked={inputdata.gender === "Female" ? true:false}
                                    onChange={setInputValue}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                                <Form.Label>Select Your Status</Form.Label>
                                <Select options={options} defaultInputValue={status} onChange={setStatusValue} />
                            </Form.Group>
                            <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                                <Form.Label>Select Your Profile</Form.Label>
                                <Form.Control type="file" placeholder="Select your profile" onChange={setProfile} name='user_profile' />
                            </Form.Group>
                            <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                                <Form.Label>Enter your Location</Form.Label>
                                <Form.Control type="text" placeholder="Enter your location" value={inputdata.location} name='location' onChange={setInputValue} />
                            </Form.Group>
                            <Button variant="primary" type="submit" onClick={submitUserData}>
                                Submit
                            </Button>
                        </Row>

                    </Form>
                </Card>
                <ToastContainer
                    position="top-center"
                    />
            </div>
    }
            
        </>
  )
}

export default Edit
