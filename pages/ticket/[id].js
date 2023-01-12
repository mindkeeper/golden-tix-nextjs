
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

//import css
import styles from "../../styles/Tiket.module.css";

//import components
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

//import image
import Image from "next/image";
import logo3 from "../../assets/logo3.png";
import icon_QR_Code_1 from "../../assets/icon_QR_Code_1.png";
import icon_download from "../../assets/icon_download.png";
import icon_printer from "../../assets/icon_printer.png";

import { useRouter } from "next/router";
import authActions from "../../redux/actions/auth";
import { useReactToPrint } from "react-to-print";
import QRCode from "qrcode.react";
function Index() {

    const [showPrint, setShowPrint] = useState("d-block");
    const token = useSelector((state) => state.auth.userData.token);
    const router = useRouter();
    const [ticket, setTicket] = useState({});
    const [seat, setSeat] = useState([]);
    const { id } = router.query;
    // download QR code
    const downloadQRCode = () => {
        let data = document.getElementById("qrCodeEl");
        console.log(data);
        const qrCodeURL = data
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
        console.log(qrCodeURL);
        let aEl = document.createElement("a");
        aEl.href = qrCodeURL;
        aEl.download = "QR_Code.png";
        document.body.appendChild(aEl);
        aEl.click();
        document.body.removeChild(aEl);
    };

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    // // const [data, setData] = useState([]);

    const [qrCodeText, setQRCodeText] = useState('');
    const [loading, setLoading] = useState(false)
    const [times, setTimes] = useState('')
    const LINK = process.env.NEXT_PUBLIC_BACKEND_URL;
    useEffect(() => {
        setLoading(true)
        if (!router.isReady) return;
        const baseUrl = `${LINK}/api/booking/ticket/detail/${router.query.id}`;
        axios
            .get(baseUrl,
                {
                    headers: {
                        "x-access-token": token
                    }
                })
            .then((res) => {
                setQRCodeText(`https://golden-tix-nextjs.vercel.app/ticket/${router.query.id}`);
                console.log(qrCodeText);
                // setData(res.data.data);

                setTicket(res.data.data);
                setSeat(res.data.data);
                setTimes(res.data.data.time)
                // console.log(res.data.data);
                setLoading(false)
            })
            .catch((err) => {
                console.log(err);
            });
    }, [router.isReady]);
    const costing = (price) => {
        return (
            "IDR " +
            parseFloat(price)
                .toFixed()
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
        );
    };
    // console.log(ticket.seats);
    return (
        <>
            <Header />
            <main>
                <section className={`${styles['content-all']} container-fluid`}>
                    <div className={`${styles['content-container']} container`}>
                        <div className={styles['content']}>
                            <p className={styles['text-payment']}>Proof of Payment</p>
                            <div className={`${styles['content-main']} row`} ref={componentRef}>
                                <div className={`${styles['content-left']} col-xl-8 col-sm-12 col-md-12`}>
                                    <div className={`${styles['content-tix']} container`} >
                                        <Image src={logo3} alt='logo3' width={100} height={40} />
                                        <p className={styles['text-admit']}>Admit One</p>
                                    </div>
                                    <div className={styles['content-movie']}>
                                        <p className={styles['text-movie']}>Movie</p>
                                        <p className={styles['text-spider']}>{seat.movie_name
                                        }</p>
                                    </div>
                                    <div className={styles['content-wrap']}>
                                        <div className={styles['content-describe']}>
                                            <p className={styles['text-date']}>Date</p>
                                            <p className={styles['text-month']}>{new Date(seat.show_date
                                            ).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })
                                            }</p>
                                        </div>
                                        <div className={styles['content-describe']}>
                                            <p className={styles['text-date']}>Time</p>
                                            <p className={styles['text-month']}> {loading ? null : times.substring(0, 5)}</p>
                                        </div>
                                        <div className={styles['content-describe']}>
                                            <p className={styles['text-date']}>Category</p>
                                            <p className={styles['text-month']}>{seat.category
                                            }</p>
                                        </div>
                                    </div>
                                    <div className={styles['content-wrap-sec']}>
                                        <div className={styles['content-describe']}>
                                            <p className={styles['text-date']}>Count</p>
                                            <p className={styles['text-month']}>{seat.ticket_total
                                            }</p>
                                        </div>

                                        <div className={styles['content-describe']}>
                                            <p className={styles['text-date']}>Seats</p>
                                            <p className={styles['text-month']}> {ticket.seats}  </p>
                                        </div>
                                        <div className={styles['content-describe']}>
                                            <p className={styles['text-date']}>Price</p>
                                            <p className={styles['text-month']}>{costing(ticket.price)
                                            }</p>
                                        </div>
                                    </div>
                                    <div className={styles['bor-total']}>
                                        <p className={styles['text-download']}>Total</p>
                                        <p className={styles['text-download']}>$30.00</p>
                                    </div>
                                </div>
                                <div className={`${styles['content-right']} col-xl-4 col-md-12 col-sm-12`}>
                                    <div className={styles['content-tix']}>
                                        <Image src={logo3} alt='logo3' width={100} height={40} />
                                    </div>
                                    <div className={`${styles['content-Qr']} px-5`}>
                                        <QRCode
                                            size={210}
                                            height="auto"
                                            id="qrCodeEl"
                                            style={{
                                                maxWidth: "100%",
                                                width: "100%",
                                            }}
                                            value={qrCodeText}
                                            viewBox={`0 0 256 256`}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={styles['content-end']}>
                                <div className={styles['bor-download']} onClick={downloadQRCode}>
                                    <Image src={icon_download} alt='icon_download' />
                                    <p className={styles['text-download']}>Download</p>
                                </div>
                                <div className={styles['bor-download']} onClick={handlePrint}>
                                    <Image src={icon_printer} alt='icon_printer' />
                                    <p className={styles['text-download']}>Print</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}

export default Index;