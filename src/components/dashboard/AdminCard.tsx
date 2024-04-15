import { Card, CardContent, Typography, Grid } from "@mui/material";

interface AdminCardProps {
  patients: number;
  doctors: number;
  labs: number;
  pharmacies: number;
}

const AdminCard: React.FC<AdminCardProps> = ({
  patients,
  doctors,
  labs,
  pharmacies,
}) => {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Typography variant="h6" color="textSecondary">
              Patients
            </Typography>
            <Typography variant="h4">{patients}</Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="h6" color="textSecondary">
              Doctors
            </Typography>
            <Typography variant="h4">{doctors}</Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="h6" color="textSecondary">
              Labs
            </Typography>
            <Typography variant="h4">{labs}</Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="h6" color="textSecondary">
              Pharmacies
            </Typography>
            <Typography variant="h4">{pharmacies}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AdminCard;
