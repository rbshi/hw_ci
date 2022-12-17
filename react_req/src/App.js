import './App.css';

import {CSmartTable, CBadge, CButton, CCollapse, CCardBody} from '@coreui/react-pro'
import {useState, useEffect} from 'react';
import axios from 'axios';

import '@coreui/coreui/dist/css/coreui.min.css'

function App() {


    const [users, setUsers] = useState([])
    const [details, setDetails] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const {data} = await axios.get("http://localhost:3010/")
            console.log(data)
            setUsers(data)
        }
        fetchData()
        // setTimeout(() => {
        //     fetchData()
        // }, 2000)
    }, [])
    const getBadge = (status) => {
        switch (status) {
            case 'Active':
                return 'success'
            case 'Inactive':
                return 'secondary'
            case 'Pending':
                return 'warning'
            case 'Banned':
                return 'danger'
            default:
                return 'primary'
        }
    }
    const toggleDetails = (index) => {
        const position = details.indexOf(index)
        let newDetails = details.slice()
        if (position !== -1) {
            newDetails.splice(position, 1)
        } else {
            newDetails = [...details, index]
        }
        setDetails(newDetails)
    }


    const columns = [
        {
            key: 'name',
            _style: { width: '40%' },
            // _props: { color: 'primary', className: 'fw-semibold' },
        },
        'registered',
        { key: 'role', filter: false, sorter: false, _style: { width: '20%' } },
        { key: 'status', _style: { width: '20%' } },
        {
            key: 'show_details',
            label: '',
            _style: { width: '1%' },
            filter: false,
            sorter: false,
            // _props: { color: 'primary', className: 'fw-semibold' },
        },
    ]

    return (
        <div className="SmartTable">
            <CSmartTable
                activePage={1}
                // cleaner
                clickableRows
                columns={columns}
                columnFilter
                // columnSorter
                // footer
                items={users}
                itemsPerPageSelect
                itemsPerPage={50}
                pagination
                scopedColumns={{
                    status: (item) => (
                        <td>
                            <CBadge color={getBadge(item.status)}>{item.status}</CBadge>
                        </td>
                    ),
                    show_details: (item) => {
                        return (
                            <td className="py-2">
                                <CButton
                                    color="primary"
                                    variant="outline"
                                    shape="square"
                                    size="sm"
                                    onClick={() => {
                                        toggleDetails(item._id)
                                    }}
                                >
                                    {details.includes(item._id) ? 'Hide' : 'Show'}
                                </CButton>
                            </td>
                        )
                    },
                    details: (item) => {
                        return (
                            <CCollapse visible={details.includes(item._id)}>
                                <CCardBody>
                                    <h4>{item.name}</h4>
                                    <p className="text-muted">User since: {item.registered}</p>
                                </CCardBody>
                            </CCollapse>
                        )
                    },
                }}
                // selectable
                sorterValue={{column: 'name', state: 'asc'}}
                tableFilter
                tableHeadProps={{
                    // color: 'danger',
                }}
                tableProps={{
                    // striped: true,
                    hover: true,
                }}
            />
        </div>
    );

}

export default App;
