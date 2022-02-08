import React,{useState} from 'react'
import Axios from 'axios'
import {useDispatch} from 'react-redux';
import {loginUser} from '../../../_actions/user_action';
import user_reducer from '../../../_reducers/user_reducer';
import {useNavigate} from 'react-router-dom';
import Auth from '../../../hoc/auth';

function LoginPage(props) {
    const navigate = useNavigate();
    
    const dispatch = useDispatch();

    const [Email,setEmail] = useState("")
    const [Password,setPassword] = useState("") //서버에 보내려 하는 값들을 state에서 갖고있음

    const onEmailHandler= (event) =>{
        setEmail(event.currentTarget.value)
    }
    const onPasswordHandler= (event) =>{
        setPassword(event.currentTarget.value)
    }
    const onSubmitHandler = (event) => {
        event.preventDefault(); //누를 때마다 페이지 refresh되는 것을 방지.
        
        let body = {
            email: Email,
            password: Password
        }
        dispatch(loginUser(body))
            .then(response => {
                if(response.payload.loginSuccess){ //login 성공하면 main(root)페이지로 이동
                    navigate('/');
                    
                }else{
                    alert('ERROR!')
                }

            })
    }

  return (
    <div style={{display:'flex', justifyContent:'center', alignItems:'center',
    width:'100%',height:'100vh' }}>
      
      <form style={{ display:'flex', flexDirection:'column'}}
      onSubmit={onSubmitHandler}>
          <label>Email</label>
          <input type="email" value={Email} onChange={onEmailHandler} />
          <label>Password</label>
          <input type="password" value={Password} onChange={onPasswordHandler} />

          <br/>
          <button type="submit" >
              login
          </button>
      </form>


    </div>
  )
}

export default Auth(LoginPage, false)
