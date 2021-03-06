import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Grid, TextField, Typography } from '@mui/material';
import { postFetch } from '../utils/utils';

function Signup() {
	const [username, setUsername] = React.useState('');
	const [password, setPassword] = React.useState('');
	
	async function handleSubmit(e){
		e.preventDefault();
		let myJSON = {}
		myJSON.username = username;
		myJSON.password = password;
		console.log(myJSON);

		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(myJSON)
		};
		const [fetchResponse, data] = await postFetch('/signup', requestOptions);
		if(fetchResponse.ok) {
			loginRedirect();			
		}
		if (data.detail === 'User already exists') {
			alert('User already exists');
		}	
	}

	const history = useHistory();

	const loginRedirect = () => {
		history.push('/login');
	}
	return (
		<form className='login' onSubmit={ handleSubmit } >
			<Grid container justifyContent="center" spacing={4}>
				<Grid item xs={12}>
					<Typography variant="h3">
						Create Account
					</Typography>
				</Grid>

				<Grid item xs={12}>
					<TextField
						required
						id="standard-username-input"
						label="Username"
						onInput ={ e => setUsername(e.target.value)}
					/>
				</Grid>

				<Grid item xs={12}>
					{/* when we use the type=password prop, it censors the password as you'd expect */}
					<TextField
						required
						id="standard-password-input"
						label="Password"
						type="password"
						onInput={ e => setPassword(e.target.value)}
					/>
				</Grid>
				<Grid item xs={12}>
					<Button type="submit" variant="contained" color="secondary">
						Create Account
					</Button>		
				</Grid>

			</Grid>
		</form>
	)
}
export default Signup;
