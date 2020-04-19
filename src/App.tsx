import React, { useState } from 'react';
import {
  Grid,
  TextField,
  Container,
  CssBaseline,
  AppBar,
  Toolbar,
  makeStyles,
  createStyles,
  Theme,
  Typography,
  Button,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  MenuItem,
} from '@material-ui/core';
import { parseCsvToRowsAndColumn } from './lib/utils';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    offset: {
      marginTop: theme.mixins.toolbar.minHeight,
      paddingTop: 25
    }
  }),
);

interface CsvType {
  csv_file: string;
  csv_data: {}[];
  csv_header: string[];
}

function App() {
  let fileReader: FileReader;

  const classes = useStyles();

  const [csv, setCsv] = useState<CsvType>({
    csv_file: '',
    csv_data: [],
    csv_header: []
  })

  const [action, setAction] = useState('');
  const [uniqueColumn, setUniqueColumn] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const handleFileRead = () => {
    const { rows, headers } = parseCsvToRowsAndColumn(fileReader.result!.toString(), ",");
    console.log(rows);
    setCsv((values) => ({ ...values, csv_data: rows, csv_header: headers }))
  }

  const handleFileChosen = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    console.log(file);
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead
    fileReader.readAsText(file);
    setCsv((values) => ({ ...values, csv_file: file.name }));
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <Container maxWidth="md">
            <Typography variant="h6">
              CSV to CouchDB
            </Typography>
            <em>under development</em>
          </Container>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" className={classes.offset}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <TextField
              type="url"
              size="small"
              label="CouchDB Link"
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={4}>
            <Button
              fullWidth
              variant="contained"
              component="label"
            >
              Test DB Connection
            </Button>
          </Grid>
          <Grid item xs={8}>
            <TextField
              size="small"
              label="CSV File"
              name="csv_file"
              fullWidth
              variant="outlined"
              value={csv.csv_file}
              disabled
            />
          </Grid>
          <Grid item xs={4}>
            <Button
              fullWidth
              variant="contained"
              component="label"
            >
              Import CSV File
              <input
                type="file"
                style={{ display: "none" }}
                onChange={handleFileChosen}
                accept=".csv"
              />
            </Button>
          </Grid>
          <Grid item xs={action === 'insert' || action === '' ? 8 : 4}>
            <TextField
              label="Action"
              select
              fullWidth
              size="small"
              variant="outlined"
              value={action}
              onChange={e => setAction(e.target.value as string)}
            >
              <MenuItem value="insert">INSERT</MenuItem>
              <MenuItem value="put">PUT / Update Content</MenuItem>
              <MenuItem value="patch">PATCH / Update Partial</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={4} style={{ display: action === 'insert' || action === '' ? 'none' : 'block' }}>
            <TextField
              label="Unique Column"
              select
              fullWidth
              size="small"
              variant="outlined"
              value={uniqueColumn}
              onChange={e => setUniqueColumn(e.target.value as string)}
            >
              {
                csv.csv_header.map((header, index) => (
                  <MenuItem key={index} value={header}>{header}</MenuItem>
                ))
              }
            </TextField>
          </Grid>
          <Grid item xs={4}>
            <Button
              fullWidth
              variant="contained"
              component="label"
            >
              Execute
            </Button>
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {
                      csv.csv_header.map((header, index) => <TableCell key={index}>{header}</TableCell>)
                    }
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    csv.csv_data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                      <TableRow key={index}>
                        {
                          Object.values(row).map((value, index2) => (
                            <TableCell key={index2} component="th" scope="row">
                              {value as string}
                            </TableCell>
                          ))
                        }
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              count={csv.csv_data.length}
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Grid>
        </Grid>

      </Container>

    </React.Fragment>
  );
}

export default App;
