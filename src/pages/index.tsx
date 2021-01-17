
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2'
import './index.css'
export default function Home() {
    const [loading, setloading] = useState(false);
    const [deleting, setdeleting] = useState(false);
    const [updating, setupdating] = useState(false);

    //---------------Getting Data------------------------------

    const [mydata, setData] = useState([]);
    useEffect(() => {
        console.log("useEffect Called");
        fetch(`/.netlify/functions/readall`)
            .then(response => response.json())
            .then(data => {
                setData(data);
                console.log("Data: " + JSON.stringify(data));
            });
    }, [loading, deleting, updating]);

    //--------------Delete Data-------------------------

    async function deleteTodo(e) {
        console.log("delete funtion Called successfully");
        console.log(e.ref["@ref"].id);
        setdeleting(true);
        await fetch(`/.netlify/functions/delete`, {
            method: 'post',
            body: JSON.stringify({ id: e.ref["@ref"].id })
        })
        setdeleting(false);
    }


    //--------------update Data-------------------------

    function updateData(e) {
        console.log("update funtion Called successfully");

        const inputOptions = {
            'Male': 'Male',
            'Female': 'Female',
            'Other': 'Other'
        }

        Swal.mixin({
            input: 'text',
            confirmButtonText: 'Next &rarr;',
            showCancelButton: true,
            progressSteps: ['1', '2', '3', '4']
        }).queue([
            {
                title: 'Roll Number',
                text: 'Enter Student Roll Number',
            },
            {
                title: 'Name',
                text: 'Enter Student Name'
            },
            {
                title: 'Email',
                text: 'Enter Student Email',
                input: 'email'
            },
            {
                title: 'Gender',
                text: 'Select Student Gender',
                input: 'radio',
                inputOptions: inputOptions,
            },
        ]).then((result:any) => {
            if (result.value) {
                console.log(result.value[0])
                Swal.fire({
                    title: 'All updation done!',
                    confirmButtonText: 'ok!'
                })
                SendData(result.value, e);
            }
        })

        async function SendData(receive, e) {
            console.log(receive);
            setupdating(true);
            await fetch(`/.netlify/functions/update`, {
                method: 'post',
                body: JSON.stringify({ id: e.ref["@ref"].id, roll_n0: receive[0], name: receive[1], email: receive[2], gender: receive[3] })
            })
            setupdating(false);
        }

    }

    //--------------------Add Student------------------------------------------
    function AddStudent() {
        console.log("Add funtion Called successfully");
        const inputOptions = {
            'Male': 'Male',
            'Female': 'Female',
            'Other': 'Other'
        }

        Swal.mixin({
            input: 'text',
            confirmButtonText: 'Next &rarr;',
            showCancelButton: true,
            progressSteps: ['1', '2', '3', '4']
        }).queue([
            {
                title: 'Roll Number',
                text: 'Enter Student Roll Number'
            },
            {
                title: 'Name',
                text: 'Enter Student Name'
            },
            {
                title: 'Email',
                text: 'Enter Student Email',
                input: 'email'
            },
            {
                title: 'Gender',
                text: 'Select Student Gender',
                input: 'radio',
                inputOptions: inputOptions,
            },
        ]).then((result:any) => {
            if (result.value) {
                console.log(result.value[0])
                Swal.fire({
                    title: 'All done!',
                    confirmButtonText: 'ok!'
                })
                SendData(result.value);
            }
        })

        async function SendData(receive) {
            console.log(receive);
            setloading(true);
            await fetch(`/.netlify/functions/create`, {
                method: 'post',
                body: JSON.stringify({ roll_n0: receive[0], name: receive[1], email: receive[2], gender: receive[3] })
            })
            setloading(false);
        }

    }


    return <div>

        <div>
            <div className="overlay">
                <h1>University of Chakwal</h1>
                <h3>All Students Record!</h3> <br />
                <button onClick={AddStudent} className="AddStudentbutton">Add Student</button>
            </div>



            <table id="students">
                <tr>
                    <th>Roll Number</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>Update</th>
                    <th>Delete</th>
                </tr>
                {mydata.map((e) => {
                    const id = e.ref["@ref"].id;
                    console.log(id);
                    return (
                        <tr>
                            <td>{e.data.roll_n0} </td>
                            <td>{e.data.name}</td>
                            <td>{e.data.email}</td>
                            <td>{e.data.gender}</td>
                            <td>
                                <a className="updatebutton" onClick={() => { updateData(e) }} >update</a>
                            </td>
                            <td>
                                <a className="deletebutton" onClick={() => { deleteTodo(e) }} >Delete</a>
                            </td>
                        </tr>
                    )
                })}
            </table>
            <br /><br /><br />
            <br /><br /><br />
        </div>
       
        <footer>
                
<p className="copyright">Copyright &copy; By Muhammad Tariq</p>

            </footer>
            
        {/* <footer className="bottom">
            <p>Copy righted by tari</p>
        </footer> */}
    </div>
}

