import React, { useEffect, useRef, useState } from "react";
import "./Print.css";
import QRCode from "react-qr-code";
import { Button } from "bootstrap";
import { useReactToPrint } from "react-to-print";
const Print = () => {
  const [printQr, setPrintQr] = useState("");
  const componentRef = useRef();

  useEffect(() => {
    setPrintQr("https://ldtax.gov.bd/dakhila/cDRwQ3R5YkZmL3FnMUVBQ2xuTUFvUT09");
  }, []); // Run this effect only once when the component mounts

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div className=" ">
      <div className="col-md-12">
        <style type="text/css">
          {`
          body {
            font-family: "kalpurush", Arial, sans-serif;
            font-size: 13px !important;
            line-height: 1.2;
            color: #333;
            background-color: #fff;
          }
          .dotted_botton {
            border: none;
            border-bottom: 1px dotted #000;
            background-color: #fff;
          }
          .border_none {
            border-top: none !important;
          }
          .table-bordered {
            border: 1px solid #ddd;
          }
          // .qrcode-print {
          //   width: 100%;
          //   display: list-item;
          //   list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFIAAABSAQMAAAD94hHYAAAABlBMVEX///8AAABVwtN+AAAACXBIWXMAAA7EAAAOxAGVKw4bAAABIElEQVQokZXTwYrFIAwF0EC2AX8l4DaQXw+4DeRXBLdCxrbDvOpbTVanUG8vVgH+OSUtfFbKuZvALQKn0eFpBVQ4/HSEcLNvN4TO9GUI7QX7k/9xSb/n6fMxAI6+2j2tPy4zpUOMyrsxi5uy174bKKO2uDu/TR2JUqbybhSnxojXO28XrOZSCfphblRLy6vdZkF2NB+0G8KFOS398PqYaBL33UUtZMXKPFyoQYEhtBt0TO3ZYu4uqcV0PJkvAwYOw1TZXYJBlKTTboSwVfzOfJt6xSkMzIfTLRuMkMPrp800nnQYw5qtSNu9nvzac4LdJYM7OV2ZbxMYmIITHZ7eiSPvM7/bU3u7124OntEGnAZ3K6S/9+XP6wxbYzWfu/85P39lX6wBqPx8AAAAAElFTkSuQmCC);
          //   list-style-position: inside;
          //   background-repeat: no-repeat;
          // }
          .b1 {
            border: 1px dotted;
            padding: 2px;
          }
        `}
        </style>
        <style type="text/css" media="print">
          {`
          @page {
            size: a4;
            margin: 0mm;
          }
          html {
            background-color: #FFFFFF;
            margin: 0px;
          }
          body {
            border: solid 0px blue;
            margin: 0mm;
          }
        `}
        </style>

        <div
          ref={componentRef}
          className="print-box printablediv "
          style={{
            fontFamily: "'kalpurush', Arial, sans-serif",
            fontSize: "14px !important",
            lineHeight: "1.2",
            color: "#333",
            backgroundColor: "#fff",
            width: "7.9in",
            height: "11in",
            borderRadius: "10px",
            border: "1px dotted  ",

            padding: "10px",
            float: "left",
            margin: "22px",
            position: "relative",
          }}
        >
          <div className="row">
            <div className="col-md-12">
              <div className="from-control">
                <table style={{ width: "100%" }}>
                  <tbody>
                    <tr>
                      <td className="text-left">বাংলাদেশ ফরম নং ১০৭৭</td>
                      <td style={{ textAlign: "right" }}>(পরিশিষ্ট: ৩৮)</td>
                    </tr>
                    <tr>
                      <td className="text-left">(সংশোধিত)</td>
                      <td
                        style={{ textAlign: "right" }}
                        className="text-right input_bangla"
                      >
                        ক্রমিক নং ৩২৯১২৩০১১০০৭
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center" colSpan="2">
                        ভূমি উন্নয়ন কর পরিশোধ রসিদ
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center" colSpan="2">
                        (অনুচ্ছেদ ৩৯২ দ্রষ্টব্য)
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div style={{ width: "100%", height: "20px" }}></div>
                <table style={{ width: "100%" }}>
                  <tbody>
                    <tr>
                      <td style={{ width: "320px" }}>
                        সিটি কর্পোরেশন /পৌর /ইউনিয়ন ভূমি অফিসের নাম :
                      </td>
                      <td className="dotted_botton">
                        ধোপাডাঙ্গা ইউনিয়ন ভূমি অফিস
                      </td>
                    </tr>
                  </tbody>
                </table>
                {/* Continue your content here */}
                <table style={{ marginTop: "5px", width: "100%" }}>
                  <tbody>
                    <tr>
                      <td style={{ width: "140px" }}>মৌজার ও জে. এল. নং:</td>
                      <td
                        className="dotted_botton"
                        style={{ padding: "0 10px 0 5px" }}
                      >
                        রাজিবপুর - ৯৯
                      </td>
                      <td style={{ width: "105px" }}>উপজেলা / থানা :</td>
                      <td
                        className="dotted_botton"
                        style={{ padding: "0 10px 0 5px" }}
                      >
                        সুন্দরগঞ্জ
                      </td>
                      <td style={{ width: "40px" }}>জেলা:</td>
                      <td
                        className="dotted_botton"
                        style={{ padding: "0 10px 0 5px" }}
                      >
                        গাইবান্ধা
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table style={{ marginTop: "5px", width: "100%" }}>
                  <tbody>
                    <tr>
                      <td style={{ width: "225px" }}>
                        {" "}
                        ২ নং রেজিস্টার অনুযায়ী হোল্ডিং নম্বর ২ নং রেজিস্টার
                        অনুযায়ী হোল্ডিং নম্বর:
                      </td>
                      <td
                        className="dotted_botton numeric_bangla"
                        style={{ paddingLeft: "10px" }}
                      >
                        ১৩০০/১
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table style={{ marginTop: "5px", width: "100%" }}>
                  <tbody>
                    <tr>
                      <td style={{ width: "75px" }}>খতিয়ান নং:</td>
                      <td
                        className="dotted_botton numeric_bangla"
                        style={{ paddingLeft: "10px" }}
                      >
                        ১৩০০
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div style={{ height: "10px" }}></div>
              </div>

              <div className="from-controll">
                <p
                  style={{
                    fontWeight: "bold",
                    fontSize: "12px",
                    textAlign: "center",
                    margin: "0",
                    padding: "0",
                  }}
                >
                  <u>মালিকের বিবরণ</u>
                </p>
              </div>
              <table
                style={{
                  border: "1px dotted",
                  borderCollapse: "collapse",
                  margin: "10px 2px",
                  width: "49%",
                  fontSize: "11px",
                  float: "left",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{ width: "10%", textAlign: "center" }}
                      className="b1"
                    >
                      ক্রমঃ
                    </th>
                    <th
                      style={{ width: "60%", textAlign: "center" }}
                      className="b1"
                    >
                      মালিকের নাম
                    </th>
                    <th
                      style={{ width: "25%", textAlign: "center" }}
                      className="b1"
                    >
                      মালিকের অংশ
                    </th>
                  </tr>
                </thead>
                <tbody style={{ height: "21px" }}>
                  <tr>
                    <td className="b1 input_bangla">১</td>
                    <td className="b1 input_bangla">দুদু মিয়া </td>
                    <td className="b1 input_bangla text-right">০.১৪৬</td>
                  </tr>
                </tbody>
              </table>
              <table
                style={{
                  border: "1px dotted",
                  borderCollapse: "collapse",
                  margin: "10px 2px",
                  width: "49%",
                  fontSize: "11px",
                  float: "right",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{ width: "10%", textAlign: "center" }}
                      className="b1"
                    >
                      ক্রমঃ
                    </th>
                    <th
                      style={{ width: "60%", textAlign: "center" }}
                      className="b1"
                    >
                      মালিকের নাম
                    </th>
                    <th
                      style={{ width: "25%", textAlign: "center" }}
                      className="b1"
                    >
                      মালিকের অংশ
                    </th>
                  </tr>
                </thead>
                <tbody style={{ height: "21px" }}>
                  <tr>
                    <td className="b1 input_bangla">২</td>
                    <td className="b1 input_bangla">চান্দ মিয়া </td>
                    <td className="b1 input_bangla text-right">০.৮৫৪</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-md-12">
            <p
              style={{
                fontWeight: "bold",
                fontSize: "12px",
                textAlign: "center",
                margin: "0",
                padding: "0",
              }}
            >
              <tbody>জমির বিবরণ</tbody>
            </p>
          </div>
          <div className="row">
            <div className="col-md-12">
              <table
                style={{
                  border: "1px dotted",
                  borderCollapse: "collapse",
                  margin: "10px 2px",
                  width: "49%",
                  fontSize: "11px",
                  float: "left",
                }}
              >
                <thead>
                  <tr>
                    <th className="b1">ক্রমঃ</th>
                    <th className="b1">দাগ নং</th>
                    <th className="b1">জমির শ্রেণী</th>
                    <th className="b1">জমির পরিমাণ (শতক)</th>
                  </tr>
                </thead>
                <tbody style={{ height: "84px" }}>
                  <tr>
                    <td className="b1 input_bangla">১</td>
                    <td className="b1 input_bangla">৬২৮১</td>
                    <td className="b1">দলা( কৃষি) </td>
                    <td className="b1 input_bangla">২০.০০০০০</td>
                  </tr>
                  <tr>
                    <td className="b1 input_bangla">২</td>
                    <td className="b1 input_bangla">৭৬১০</td>
                    <td className="b1">ডাঙ্গা( কৃষি) </td>
                    <td className="b1 input_bangla">৯৮.০০০০০</td>
                  </tr>
                  <tr>
                    <td className="b1 input_bangla">৩</td>
                    <td className="b1 input_bangla">৭৯৪৭</td>
                    <td className="b1">ডাঙ্গা( কৃষি) </td>
                    <td className="b1 input_bangla">২০.০০০০০</td>
                  </tr>
                  <tr>
                    <td className="b1 input_bangla">৪</td>
                    <td className="b1 input_bangla">৭৯৪৮</td>
                    <td className="b1">বাগান( কৃষি) </td>
                    <td className="b1 input_bangla">১০.০০০০০</td>
                  </tr>
                </tbody>
              </table>
              <table
                style={{
                  border: "1px dotted",
                  borderCollapse: "collapse",
                  margin: "10px 2px",
                  width: "49%",
                  fontSize: "11px",
                  float: "right",
                }}
              >
                <thead>
                  <tr>
                    <th className="b1">ক্রমঃ</th>
                    <th className="b1">দাগ নং</th>
                    <th className="b1">জমির শ্রেণী</th>
                    <th className="b1">জমির পরিমাণ (শতক)</th>
                  </tr>
                </thead>
                <tbody style={{ height: "63px" }}>
                  <tr>
                    <td className="b1 input_bangla">৫</td>
                    <td className="b1 input_bangla">৭৯৪৯</td>
                    <td className="b1">বাড়ী( আবাসিক) </td>
                    <td className="b1 input_bangla">১১.০০০০০</td>
                  </tr>
                  <tr>
                    <td className="b1 input_bangla">৬</td>
                    <td className="b1 input_bangla">৭৯৫২</td>
                    <td className="b1">ডাঙ্গা( কৃষি) </td>
                    <td className="b1 input_bangla">৪.০০০০০</td>
                  </tr>
                  <tr>
                    <td className="b1 input_bangla">৭</td>
                    <td className="b1 input_bangla">৭৯৬১</td>
                    <td className="b1">ভিটা( কৃষি) </td>
                    <td className="b1 input_bangla">১৩.০০০০০</td>
                  </tr>
                </tbody>
              </table>

              <table
                style={{
                  border: "1px dotted",
                  borderCollapse: "collapse",
                  margin: "10px 2px",
                  width: "100%",
                  fontSize: "12px",
                }}
              >
                <tbody>
                  <tr>
                    <td className="b1 text-center" style={{ width: "50%" }}>
                      সর্বমোট জমি (শতক)
                    </td>
                    <td className="b1 input_bangla" style={{ width: "50%" }}>
                      ১৮০
                    </td>
                  </tr>
                </tbody>
              </table>
              <div style={{ height: "10px" }}></div>
              <table
                className="table table-striped table-bordered table-hover"
                style={{
                  margin: "10px 2px",
                  width: "100% !important",
                  borderCollapse: "collapse",
                }}
              >
                <tbody>
                  <tr>
                    <th style={{ textAlign: "center" }} colSpan="8">
                      আদায়ের বিবরণ{" "}
                    </th>
                  </tr>

                  <tr>
                    <td style={{ textAlign: "center" }}>
                      তিন বৎসরের ঊর্ধ্বের বকেয়া
                    </td>
                    <td style={{ textAlign: "center" }}>
                      গত তিন বৎসরের বকেয়া
                    </td>
                    <td style={{ textAlign: "center" }}>
                      বকেয়ার সুদ ও ক্ষতিপূরণ
                    </td>
                    <td style={{ textAlign: "center" }}>হাল দাবি</td>
                    <td style={{ textAlign: "center" }}>মোট দাবি</td>
                    <td style={{ textAlign: "center" }}>মোট আদায়</td>
                    <td style={{ textAlign: "center" }}>মোট বকেয়া</td>
                    <td style={{ textAlign: "center" }}>মন্তব্য</td>
                  </tr>

                  <tr>
                    <td
                      align="center"
                      style={{
                        borderRight: "1px solid #bfbfbf",
                        borderBottom: "1px solid #bfbfbf",
                      }}
                    >
                      ৯৩৬
                    </td>
                    <td
                      align="center"
                      style={{
                        borderRight: "1px solid #bfbfbf",
                        borderBottom: "1px solid #bfbfbf",
                      }}
                    >
                      ৩৩৩
                    </td>
                    <td
                      align="center"
                      style={{
                        borderRight: "1px solid #bfbfbf",
                        borderBottom: "1px solid #bfbfbf",
                      }}
                    >
                      ৫৪১
                    </td>
                    <td
                      align="center"
                      style={{
                        borderRight: "1px solid #bfbfbf",
                        borderBottom: "1px solid #bfbfbf",
                      }}
                    >
                      ১১১
                    </td>
                    <td
                      align="center"
                      style={{
                        borderRight: "1px solid #bfbfbf",
                        borderBottom: "1px solid #bfbfbf",
                      }}
                    >
                      ১,৯২১
                    </td>
                    <td
                      align="center"
                      style={{
                        borderRight: "1px solid #bfbfbf",
                        borderBottom: "1px solid #bfbfbf",
                      }}
                    >
                      ১,৯২১
                    </td>
                    <td
                      align="center"
                      style={{ borderBottom: "1px solid #bfbfbf" }}
                    >
                      ০{" "}
                    </td>
                    <td
                      align="center"
                      style={{
                        borderBottom: "1px solid #bfbfbf",
                        borderRight: "1px solid #bfbfbf",
                      }}
                    ></td>
                  </tr>
                </tbody>
              </table>

              <div style={{ width: "100% !important", margin: "10px 2px" }}>
                <p className="dotted_botton">
                  {" "}
                  সর্বমোট (কথায়): এক হাজার নয় শত একুশ টাকা মাত্র ।
                </p>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div style={{ width: "330px", float: "left" }} align="left">
                    <p style={{ margin: "0 !important" }}></p>
                    <p style={{ margin: "0 !important" }}>
                      নোট: সর্বশেষ কর পরিশোধের সাল - ১৪১৬ থেকে ১৪৩০
                    </p>
                    <p></p>
                    <p className="input_bangla"> চালান নং : ২৩২৪-০০১১১৬৪৭৬১</p>
                      
                    <p className="mt-2">তারিখ : </p>
                    <div style={{ marginTop: "-28px", marginLeft: "10px" }}>
                      <p
                        style={{
                          width: "115px",
                          padding: "0",
                          margin: "0",
                          marginLeft: "38px",
                          marginBottom: "12px",
                        }}
                      >
                        ১৭ আশ্বিন ১৪৩০
                      </p>
                      <span
                        style={{ borderTop: "1px solid", marginLeft: "36px" }}
                      >
                        ০২ অক্টোবর, ২০২৩
                      </span>
                      <p></p>
                    </div>
                    <p></p>
                  </div>
                  <div style={{ width: "90px", float: "left" }} align="center">
                    <div className="qrcode-print"></div>
                    <p></p>
                  </div>
                  <div
                    style={{ width: "235px", float: "right" }}
                    align="center"
                  >
                    <p>
                      এই দাখিলা ইলেক্ট্রনিকভাবে তৈরি করা হয়েছে,
                      <br />
                      কোন স্বাক্ষর প্রয়োজন নেই।
                    </p>
                  </div>
                  {/* Can be anything instead of `maxWidth` that limits the width. */}
                  <div
                    style={{
                      height: "auto",
                      margin: "0 auto",
                      maxWidth: 64,
                      width: "100%",
                    }}
                  >
                    <QRCode
                      size={256}
                      style={{
                        height: "auto",
                        maxWidth: "110%",
                        width: "110%",
                      }}
                      value={printQr}
                      viewBox={`0 0 256 256`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="col-md-12">
            <div>
              <div className="col-md-12">
                <div style={{ textAlign: "center", display: "block" }}>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="btn btn-md btn-success"
                    href="https://ldtax.gov.bd/ldtax-holdings/individual-rashid-print-offline-preview/cDRwQ3R5YkZmL3FnMUVBQ2xuTUFvUT09"
                    target="_blank"
                    style={{ marginTop: "10px", padding: "10px" }}
                  >
                    প্রিন্ট
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Print;
