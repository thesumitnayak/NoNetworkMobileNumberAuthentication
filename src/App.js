import { useState, useEffect } from "react";
import {Container, Card, CardContent, makeStyles, Grid, TextField, Button} from '@material-ui/core';
import InputAdornment from "@material-ui/core/InputAdornment";
import QRCode from 'qrcode';
import validator from "validator";
import emailjs, { send } from "@emailjs/browser";
import React, { useRef} from 'react';

function App() {
  const classes = useStyles();
  const [text, setText] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [isError, setIsError] = useState(false);
  const [st, setSt] = useState(true);
  const [scanORerr, setScanORerr] = useState('ENTER MOBILE NUMBER TO GET QR CODE');
  const [otp, setOtp] = useState();
  var gotp = Math.floor(1000 + Math.random() * 9000);
  const [generatedOTP, setGeneratedOTP] = useState(gotp);
  var correct = false;
  const [corr, setCorr] = useState(correct);
  const [num, setnum] = useState('');
  var realOtp = 0;

  const validatePhoneNumber = (number) => {
    const isValidPhoneNumber = validator.isMobilePhone(number);
    return (isValidPhoneNumber);
   }

  const generate = () =>{
    gotp = Math.floor(1000 + Math.random() * 9000);
    return gotp;
  }

  const generateQRCode = async() =>{
    try{
      if(validatePhoneNumber(text) && text.length == 10){
        setGeneratedOTP(generate());
        // console.log(gotp);
        const response = await QRCode.toDataURL(text+"\n"+gotp+"\nsinisterrules@1101");
        setImageURL(response);
        setText("");
      }
      else{
        setImageURL("");
        setSt(false);
        setScanORerr("PLEASE ENTER CORRECT MOBILE NUMBER");
        setText("");
      }
    }catch(error){
      console.log(error);
    }
  }

  const verifyOTP = () =>{
    var a = generatedOTP.toString();
    realOtp = num.charAt(a.charAt(0))+num.charAt(a.charAt(1))+num.charAt(a.charAt(2))+num.charAt(a.charAt(3)); 
    // console.log(realOtp, parseInt(otp), isError);
    if(isError == false){
        if(realOtp == parseInt(otp)){
          correct = true;
          setCorr(correct);
          setImageURL("");
          setSt(false);
          setScanORerr("OTP VERIFIED");
          setText("");
        }
        else{
          correct = false;
          setCorr(correct);
          setImageURL("");
          setSt(false);
          setScanORerr("INCORRECT OTP");
          setText("");
        }
    }
  }

  const [toSend, setToSend] = useState({
    otp: '',
    to: '',
  });

  const onSubmit = (e) => {
    e.preventDefault();
    {/* --- METHOD TO SEND THE MAIL --- */}
    send(
        'service_gzsklyb',
        'template_f7mipj7',
        toSend,
        'esCWuztJr0VB2-3Sl'
      )
        .then((response) => {
          console.log('SUCCESS!', response.status, response.text);
        })
        .catch((err) => {
          console.log('FAILED...', err);
        });
  };

  const handleChange = (e) => {
    setToSend({ ...toSend, [e.target.name]: e.target.value });
  };

  return (
  <Container className={classes.container}>
    <Card className={classes.header}>
      <h2>HACK_ELITE &copy;</h2>
    </Card>
    <Card>
      <h2 className={classes.title}>Generate QR Code</h2>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
            <Container  className={classes.grid}>
            <TextField type="tel" style = {{width: 300}} id="input" error={isError} label="Enter Mobile Number"
            onChange={(e)=>{
              if (e.target.value.length != 10) {
                setIsError(true);
                setText("");
              }
              else{
                setnum(e.target.value);
                setIsError(false);
                setText(e.target.value);
              }
            }}
            InputProps={{
              startAdornment: <InputAdornment position="start">
                 +91</InputAdornment>,
            }}/>

            <div className={classes.grid1}>
            <form onSubmit={onSubmit}>
                    <TextField
                        label="Enter Email Address"
                        type='text'
                        name='to'
                        placeholder='Your email'
                        value={toSend.reply_to}
                        onChange={handleChange}
                        className="input1"
                        style = {{width: 300}}
                    />
                    <input
                        type='hidden'
                        name='otp'
                        id='otp'
                        placeholder='Your otp'
                        value={toSend.otp=generatedOTP}
                        onChange={handleChange}
                        disabled
                    />
                    <Button type="submit" className={classes.btn1} variant="contained" color="primary" onClick={()=>{generateQRCode();}}>Generate QR CODE</Button>
                </form>
            </div>

            </Container>
          </Grid>
          <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
            <Container  className={classes.grid}>
            {imageURL ? <div className={classes.divQR}>
                          <h3 className={classes.scan}>SCAN THE QR CODE TO GET OTP</h3><img src={imageURL} alt="img"/></div> :
                          <h3 
                          style={(corr)?{color:"#6ade4e",fontSize:20}:{}} 
                          className={classes.scan}>{scanORerr}</h3>
            }
            </Container>
          </Grid>
          <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
            <Container  className={classes.grid}>
            <TextField type="tel" error={isError} label="Enter OTP" 
            onChange={(e)=>{
              if (e.target.value.length != 4){
                setIsError(true);
                setOtp('');
              }
              else{
                setIsError(false);
                setOtp(e.target.value);
              }
            }}
            InputProps={{
              startAdornment: <InputAdornment position="start">
                 OTP</InputAdornment>,
            }}/>
            <Button className={classes.btn2} variant="contained" color="primary" onClick={()=>{verifyOTP();}}>VERIFY OTP CODE</Button>
            </Container>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  </Container>
  );
}

const useStyles = makeStyles((theme) =>({
  
  container:{
    marginTop:0,
    height:"90vh",
    // background:"grey"
  },
  header:{
    marginTop:20,
    marginBottom:120,
    background:"#fb8500",
    height:"10vh",
    alignItems:"center",
    justifyContent:"center",
    display:"flex",
    fontFamily:"Droid Sans",
    borderRadius:2
  },
  grid:{
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    flexWrap:"wrap",
    // background:"grey",
    height: '30vh',
  },
  grid1:{
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    flexWrap:"wrap",
    // background:"grey",
    height: '30vh',
    paddingLeft: 20
  },
  title:{
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    background:"#3f51b5",
    color:"#fff",
    padding:20
  },
  btn1:{
    marginTop:10,
    marginBottom:20,
    margin: "100px 50px"
  },
  btn2:{
    marginTop:10,
    marginBottom:20,
  }, 
  divQR:{
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    flexWrap:"wrap"
  },
  scan:{
    margin:"10 0",
    font:9,
    color:"red"
  },
  input1:{
    padding:"10 40"
  }
}))
export default App;