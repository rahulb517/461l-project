import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Grid, TextField, Typography } from '@material-ui/core';

function CreateAccount() {
	const [username, setUsername] = React.useState('');
	const [password, setPassword] = React.useState('');
	
	function handleSubmit(e){
		e.preventDefault();
		let myJSON = {}
		myJSON.username = username;
		myJSON.password = password;
		console.log(myJSON);
		loginRedirect();
	}

	const history = useHistory();

	const loginRedirect = () => {
		history.push('/login');
	}
	return (
		<form onSubmit={ handleSubmit } >
			<Grid container justifyContent="center" spacing={4}>
				<Grid item xs={12}>
					<Typography variant="h3">
						Create Account
					</Typography>
				</Grid>

				<Grid item xs={12}>
					<TextField
						id="standard-username-input"
						label="Username"
						onInput ={ e => setUsername(e.target.value)}
					/>
				</Grid>

				<Grid item xs={12}>
					<TextField
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
export default CreateAccount;
