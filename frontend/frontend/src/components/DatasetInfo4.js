import { useQuery } from 'react-query';
import { Button, Grid, Paper } from '@mui/material';
import { getFetch } from '../utils/utils';

const fetchDatasets = async () => {
	const datasetsData = await getFetch('/datasets');
	return datasetsData;
}

function DatasetInfo4() {
    const {data, status} = useQuery('datasets', fetchDatasets, {
        staleTime: 2000,
    });
    console.log(data);

return(
    status === 'success' && (
        <Grid item xs={12}>
        <Paper >
            <Grid justifyContent="center" alignItems="center" container spacing={4}>
                <Grid item xs={12}>
                    <p> <b>Abstract: </b>{data.Pain.abstract}</p>
                    <p> <b>Background: </b>{data.Pain.background}</p>
                    <Button href= {data.Pain.url}>Download</Button>
                </Grid>
            </Grid>
        </Paper>
    </Grid>
    )
)
}
export default DatasetInfo4;