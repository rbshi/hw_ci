import './App.css';

import {CSmartTable, CBadge, CButton, CCollapse, CCardBody} from '@coreui/react-pro'
import {useState, useEffect} from 'react';
import axios from 'axios';

import '@coreui/coreui/dist/css/coreui.min.css'

function App() {

    const [events, setEvents] = useState([])
    const [details, setDetails] = useState([])

    useEffect(() => {

        function buildStatus(nev) {
            if (nev.event.vivado_error.length){
                return 'error'
            }
            else if (nev.event.coyote_base[nev.event.coyote_base.length-1].process==='Bitstreams coppied'){
                return 'done'
            }
            else {
                return 'doing'
            }
        }

        async function translateFromNetEvents(net_events){
            var evs = []
            for (const nev of net_events) {
                const ev = {
                    build_dir: nev.dir,
                    design: 'tba',
                    status: buildStatus(nev),
                    details: JSON.stringify([nev.event.coyote_base, nev.event.vivado_base, nev.event.vivado_error], null, 4)
                }
                await evs.push(ev)
            }
            return evs
        }


        const fetchData = async () => {
            const net_events = await axios.get("http://localhost:3010/build_coyote")
            const evs = await translateFromNetEvents(net_events.data)
            setEvents(evs)
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
        { key: 'build_dir', label: 'Build', _style: { width: '5%' } },
        { key: 'design', label: 'Design', _style: { width: '10%' } },
        { key: 'status', label: 'Build Status', _style: { width: '10%' } },
        { key: 'show_details', label: '', _style: { width: '1%' }, filter: false },
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
                items={events}
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
                                    <pre>{item.details}</pre>
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
