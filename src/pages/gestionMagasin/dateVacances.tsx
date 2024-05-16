import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
    GridRowsProp,
    GridRowModesModel,
    GridRowModes,
    DataGrid,
    GridColDef,
    GridToolbarContainer,
    GridActionsCellItem,
    GridEventListener,
    GridRowId,
    GridRowModel,
    GridRowEditStopReasons,
    GridValueGetterParams,
    GridValueSetterParams,
    // GridSlots,
} from '@mui/x-data-grid';
import {
    randomCreatedDate,
    randomTraderName,
    randomId,
    randomArrayItem,
} from '@mui/x-data-grid-generator';

const initialRows: GridRowsProp = [
    {
        id: randomId(),
        nom: "vacance 1",
        dateDebut: null,
        dateFin: null,
    },
    {
        id: randomId(),
        nom: "vacance 2",
        dateDebut: null,
        dateFin: null,
    },
    {
        id: randomId(),
        nom: "vacance 3",
        dateDebut: null,
        dateFin: null,
    },
    {
        id: randomId(),
        nom: "vacance 4",
        dateDebut: null,
        dateFin: null,
    },
    {
        id: randomId(),
        nom: "vacance 5",
        dateDebut: null,
        dateFin: null,
    },
];

interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
}

function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
        const id = randomId();
        setRows((oldRows) => [...oldRows, { id, nom: '', isNew: true }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'nom' },
        }));
    };

    return (
        <Box
            sx={{
                borderBottom: 1,
                borderColor: 'divider',
                p: 1,
                alignSelf: 'center'
            }}
        >

            {/* <GridToolbarContainer> */}
            <Button color="primary" startIcon={<AddCircleOutlineOutlinedIcon />} onClick={handleClick} variant="contained">
                Create
            </Button>
            {/* </GridToolbarContainer> */}
        </Box>
    );
}

export default function FullFeaturedCrudGrid() {
    const [rows, setRows] = React.useState(initialRows);
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id: GridRowId) => () => {
        setRows(rows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow: GridRowModel) => {
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns: GridColDef[] = [
        { field: 'nom', headerName: 'Nom de vacances', flex: 1, minWidth: 150, editable: true, headerAlign: 'center', align: 'center' },
        {
            field: 'dateDebut',
            headerName: 'Date de debut',
            type: 'date',
            flex: 1,
            minWidth: 180,
            editable: true,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'dateFin',
            headerName: 'Date de fin',
            type: 'date',
            flex: 1,
            minWidth: 180,
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            flex: 1,
            minWidth: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    const years = Array.from({ length: 7 }, (_, i) => new Date().getFullYear() - 2 + i);

    return (
        <Box
            sx={{
                height: 375,
                width: '100%',
                '& .actions': {
                    color: 'text.secondary',
                },
                '& .textPrimary': {
                    color: 'text.primary',
                },
                marginBottom: 6,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: "center"
                }}
            >
                <Typography variant="body1" >Precision des dates de vacances</Typography >
                <Tabs
                    // value={selectedYear}
                    // onChange={handleYearChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    sx={{
                        // flexGrow: 1,
                        maxWidth: { xs: 170, sm: 170 },
                        bgcolor: 'background.paper',
                        flexDirection: 'row',
                        [`& .${tabsClasses.scrollButtons}`]: {
                            '&.Mui-disabled': { opacity: 0.3 },
                        },
                    }}

                >
                    {years.map((year) => (
                        <Tab key={year} label={year} value={year.toString()} />
                    ))}
                </Tabs>
            </Box>
            <DataGrid
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slots={{
                    // toolbar: EditToolbar,
                    footer: EditToolbar,
                }}
                slotProps={{
                    // toolbar: { setRows, setRowModesModel },
                    footer: { setRows, setRowModesModel } as any,
                    // 疑问
                }}
                sx={{
                    '&, .MuiDataGrid': { border: 'none', borderBottom:'1px solid #E0E0E0',borderRadius:0 },
                }}
            />
        </Box>
    );
}
