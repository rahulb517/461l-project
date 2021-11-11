import React from 'react';
import { useHistory } from 'react-router-dom';
import {Alert, Button, Grid, Input, TextField, Typography } from '@mui/material';
import ResourceInfo from './ResourceInfo';
import { QueryClient, QueryClientProvider } from 'react-query';
import Select from 'react-select';
import { AuthContext } from '../AuthContext';



const queryClient = new QueryClient()
function Resources() {
	const [user, dispatch] = React.useContext(AuthContext);
	const [quantity, setQuantity] = React.useState('');
	const [projectList, setProjectList] = React.useState([]);
	const [resourceList, setResourceList] = React.useState([]);
	const [projectSelected, setProjectSelected] = React.useState('');
	const [resourceSelected, setResourceSelected] = React.useState('');
	const [validTransaction, setValidTransaction] = React.useState('');
	const [actionType, setActionType] = React.useState('');


	const projectOptions = [];
	for (const project of projectList) {
		projectOptions.push({value: project, label: project})
	}
	const resourceOptions = [];
	for (const resource of resourceList) {
		resourceOptions.push({value: resource, label: resource})
	}

	React.useEffect(() => {
		async function fetchData() {
			let userId = user.user.replace(/["]+/g, '')
			const projFetchResponse = await fetch(`http://localhost:8000/api/projects/${userId}`);
			const resourceFetchResponse = await fetch('http://localhost:8000/api/resources');
			const projData = await projFetchResponse.json();
			const resourceData = await resourceFetchResponse.json();
			setResourceList(Object.keys(resourceData));
			console.log(Object.keys(resourceData))
			setProjectList(projData['projects']);
		}
		fetchData();
	}, []);
	
	async function handleSubmit(e){
		e.preventDefault();
		let payload = {}
		payload.name = resourceSelected;
		payload.amount = quantity;
		payload.type = actionType;
		console.log(payload);

		const requestOptions = {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(payload)
		};
		if (actionType === 'checkout') {
			try {
				const fetchResponse = await fetch(`http://localhost:8000/api/resources/`, requestOptions);
				const data = await fetchResponse.json();
				if(!fetchResponse.ok){
					throw data.detail;
				}
				if(data.availability === 0) {
					setValidTransaction('Incomplete checkout')
				}
				else{
					setValidTransaction('Complete checkout');
				}
				let projCheckoutPayload = {}
				projCheckoutPayload.project_id = projectSelected;
				projCheckoutPayload.hardware = {[resourceSelected]: data.checkedOut};

				const checkoutRequestOptions = {
					method: 'PUT',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify(projCheckoutPayload)
				}
				console.log(projCheckoutPayload)
				const projFetchResponse = await fetch('http://localhost:8000/api/projects/', checkoutRequestOptions)

			} catch(err) {
				console.log(err);
				setValidTransaction('Invalid checkout');
			}
		}

		else if (actionType === 'checkin') {
			try {
				let projCheckinPayload = {}
				projCheckinPayload.project_id = projectSelected;
				projCheckinPayload.hardware = {[resourceSelected]: (-1) * quantity};

				const checkinRequestOptions = {
					method: 'PUT',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify(projCheckinPayload)
				}
				const fetchResponse = await fetch('http://localhost:8000/api/projects/', checkinRequestOptions)
				const data = await fetchResponse.json()
				if(!fetchResponse.ok){
					throw data.detail;
				}
				setValidTransaction('Valid checkin');
				const resourcesFetchResponse = await fetch(`http://localhost:8000/api/resources/`, requestOptions);

			} catch(err) {
				console.log(err);
				setValidTransaction('Invalid checkin');
			}
		}
		
	}

	const renderTransactionStatus = () => {
		if (validTransaction === 'Complete checkout' || validTransaction === 'Valid checkin') {
			return(
				<Grid item xs={12}>
					<Alert severity="success">
						Successfully fulfilled request
					</Alert>
				</Grid>
			)
		}

		if (validTransaction === 'Incomplete checkout') {
			return(
				<Grid item xs={12}>
					<Alert severity="success">
						This request may not have been completely fulfilled
					</Alert>
				</Grid>
			)
		}

		else if (validTransaction === 'Invalid checkout') {
			return(
				<Grid item xs={12}>
					<Alert severity="error">
						Something went wrong
					</Alert>
				</Grid>
			)
		}

		else if (validTransaction === 'Invalid checkin') {
			return(
				<Grid item xs={12}>
					<Alert severity="error">
						Cannot check in that many resources
					</Alert>
				</Grid>
			)
		}
	}
    return(
        <React.Fragment>
			<div className='infoCard'>
				<QueryClientProvider client={queryClient}>
					<ResourceInfo />
				</QueryClientProvider>
			</div>
			
			<form className='resourceForm' onSubmit={ handleSubmit } >
				<Grid container justifyContent="center" spacing={4}>
					<Grid item xs={12}>
						<Typography variant="h3">
							Resource Manager
						</Typography>
					</Grid>
					
					<Grid item xs={12}>
						<Select
							options={projectOptions}
							onChange=
							{e => {setProjectSelected(e.value)}}
						/>
					</Grid>
					<Grid item xs={12}>
						<Select
							options={resourceOptions}
							onChange=
							{e => {setResourceSelected(e.value)}}
						/>
					</Grid>

					<Grid item xs={12}>
						<TextField
							required
							type="number"
							label="Quantity"
							onChange ={ e => setQuantity(Math.abs(e.target.value))}
						/>
					</Grid>

					{renderTransactionStatus()}

					<Grid item xs={6}>
						<Button type="submit"
							variant="contained"
							color="primary"
							onClick={() => setActionType('checkin')}>
								Check In
						</Button>
					</Grid>
					<Grid item xs={6}>
						<Button type="submit"
							variant="contained"
							color="primary"
							onClick={() => setActionType('checkout')}>
								Checkout
						</Button>
					</Grid>
				</Grid>
			</form>
		</React.Fragment>
    )
}

export default Resources