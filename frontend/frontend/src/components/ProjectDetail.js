import React from 'react';
import { useQuery } from 'react-query'
import { Alert, Grid, Paper, Accordion, AccordionDetails, AccordionSummary, Typography} from '@mui/material';
import { AuthContext } from '../AuthContext';
import { getFetch } from '../utils/utils';

function ProjectDetail(){
    const [user, dispatch] = React.useContext(AuthContext);
	const {data, status} = useQuery('projectdetails', async () => {
		let userId = user.user.replace(/["]+/g, ''); // this removes quotes around the username, if any. This is important when the user refreshes the page
		const projectDetailData = await getFetch(`/projects/hardware/${userId}`);
		return projectDetailData;
	}, {
		staleTime: 1000,
		//placeholderData: { HWSet1: "{\"_id\": {\"$oid\": \"617ba4a3885d8944d1b2961a\"}, \"name\": \"HWSet1\", \"capacity\": 200, \"availability\": 200}", HWSet2: "{\"_id\": {\"$oid\": \"617ba4e26c2b00b199b0b081\"}, \"name\": \"HWSet2\", \"capacity\": 200, \"availability\": 200}" },
	});
	console.log(data)

	function renderHardware(project){
		let hardwaresets = []

		for (const [key, value] of Object.entries(project['hardware'])){
			hardwaresets.push(
				<p>{key}: {value} checked out</p>
			)
		}
		return hardwaresets
	}

	function renderMembers(project){
		let members = 'Members: '

		for(const member of project['members']){
			members += member + ' '
		}
		return members
	}

	function renderProjectDetails(){
		
		let projectdetails = []
		
		for (const project of data['projectdetails']){
			projectdetails.push(
				<Accordion>
					<AccordionSummary>
						<p key={project['name']}>Project ID: {project['project_id']}</p>
					</AccordionSummary>
					<AccordionDetails>
							<p>Project Name: {project['name']}</p>
							<p>Description: {project['description']}</p>
							{renderHardware(project)}
							{renderMembers(project)}
					</AccordionDetails>
				</Accordion>
			)
		}
		return projectdetails
	}

	// let project = data['projectdetails']

	return (
		<>
			{status === 'success' && (
				<>
					<Grid item xs={12}>
						<Paper >
							<Grid justifyContent="center" alignItems="center" container spacing={4}>
								<Grid item xs={12}>
									<h3>My Projects:</h3>
									{renderProjectDetails()}
								</Grid>
							</Grid>
						</Paper>
					</Grid>
				</>
			)}
			{status === 'error' && (
				<Grid item xs={12}>
					<Alert severity="error">
						Cannot retrieve data
					</Alert>
				</Grid>
			)}
		</>	
	)

} export default ProjectDetail