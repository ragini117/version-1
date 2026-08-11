'use client'
import React, { useEffect, useState } from 'react'
import styles from './sales.module.css'
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import Swal from 'sweetalert2';
import { apiUrl } from '../../../environment';
import { useRouter } from 'next/navigation';

const index = () => {
    const [number, setNumber] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [country, setCountry] = useState('India')
    const targetDate = new Date('2024-09-15T00:00:00').getTime();
    const [timeLeft, setTimeLeft] = useState(targetDate - new Date().getTime());
    const router = useRouter()
    const countries = [
        'India',
        'Russia',
        'Nepal',
        'France',
        'Turkey',
        'Pakistan',
        'China',
        'United Arab Emirates',
        'Saudi Arabia',
        'Italy',
        'Thailand',
        'Iran',
        'Bangladesh',
        'Vietnam',
        'Germany',
        'South Korea',
        'Japan',
        'Portugal',
        'Brazil',
        'Indonesia',
    ];
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const data = {
                country: country,
                name: name,
                number: number,
                email: email,
            }

            const response = await axios.post(`${apiUrl}/bnb/deod/form`, data)
            console.log(response)
            if (response.status == 201) {
                Swal.fire({
                    title: "Form Filled Successfully!",
                    text: "Thank you for participating",
                    icon: "success",
                    // showCancelButton: true,
                    confirmButtonText: "Explore Decentrawood",
                    // cancelButtonText: "cancel",
                    reverseButtons: true,
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        router.push("/");
                    }
                });
            }
        } catch (error) {
            console.log(error)
        }
    }
  
  
    // State to hold remaining time in seconds
    const formatTimeLeft = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      };
    // useEffect to update the countdown
    useEffect(() => {
      const intervalId = setInterval(() => {
        const currentTime = new Date().getTime();
        const difference = targetDate - currentTime;
  
        // Stop the countdown when time runs out
        if (difference <= 0) {
          clearInterval(intervalId);
          setTimeLeft(0);
        } else {
          setTimeLeft(difference);
        }
      }, 1000);
  
      // Cleanup interval when component unmounts
      return () => clearInterval(intervalId);
    }, [targetDate]);
  
    // Function to format time left in HH:MM:SS
   
  
    return (
        <>
            <section className={`${styles.connect_bg}`}>
                <div className="container py-2">
                    <div className="row align-items-center">
                        <div className="col-md-6 col-12">
                            <div className={`${styles.header_box} mt-4`}>
                                <h2>BNB DEOD Form</h2>
                            </div>
                            <div className={`${styles.ragister_main_box}`}>
                            <div className="col-12">
                            <div className=' text-center'>
                            <h2 style={{color:'lightgray'}}>Hurry ! Few Days Left</h2>
                            <h2 className='text-white'>{formatTimeLeft(timeLeft)}</h2>
                            </div>
                        </div>
                                <div className="row">
                                    <form onSubmit={handleSubmit}>
                                        <div className="col-12 col-md-12">
                                            <div className="mb-3">
                                                <label className={`form-label ${styles.cus_label}`}>
                                                    Name
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${styles.cus_form}`}
                                                    placeholder="Name"
                                                    name="Name"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    required />
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-12">
                                            <div className="mb-3">
                                                <label className={`form-label ${styles.cus_label}`}>
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    className={`form-control ${styles.cus_form}`}
                                                    placeholder="Email"
                                                    name="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />

                                            </div>
                                        </div>
                                        <div className="col-12 col-md-12">
                                            <div className="mb-3">
                                                <label className={`form-label ${styles.cus_label}`}>
                                                    Mobile Number
                                                </label>
                                                <input
                                                    className={`form-control ${styles.cus_form}`}
                                                    placeholder="Mobile number"
                                                    name="number"
                                                    value={number}
                                                    onChange={(e) => setNumber(e.target.value)}
                                                    required
                                                />

                                            </div>
                                        </div>          <div className="col-12 col-md-12">
                                            <div className="mb-3">
                                                <label className={`form-label ${styles.cus_label}`}>
                                                    Country
                                                </label>
                                                <select
                                                    className={`form-control ${styles.cus_form}`}
                                                    placeholder="country"
                                                    name="country"
                                                    value={country}
                                                    onChange={(e) => setCountry(e.target.value)}
                                                >
                                                    {countries.map((data, index) => (
                                                        <option className='form-control' key={index} value={data}>
                                                            {data}
                                                        </option>
                                                    ))}

                                                </select>

                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="text-center">
                                                <button
                                                    type="submit"
                                                    className={`btn ${styles.cus_refrral_btn}`}
                                                >
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-md-6 ">
                            <div className={` ${styles.register_img}`}>
                                <iframe src="https://www.youtube.com/embed/8oeJ3GrovlI?si=TOZ3XrAb4B9W4SW8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                            </div>
                        </div>
                       
                    </div>
                </div>

                {/* bottom footer wallet */}

                {/* <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className={`${styles.fotter_bottom}`}>
                                <p> Already have an account?
                                    <a href=""> Login?</a></p>
                            </div>

              <div className={` ${styles.fotter_bottom2}`}>
                <p>Secured by Decentrawood</p>
              </div>
            </div>
          </div>
        </div> */}
                <ToastContainer />
            </section>
        </>
    )
}

export default index