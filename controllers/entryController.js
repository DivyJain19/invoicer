const asyncHandler = require('express-async-handler');
const Entry = require('../models/entryModel');
const Product = require('../models/productModel');
const puppeteer = require('puppeteer');
const { formatDate } = require('../utils/helper');

exports.addEntry = asyncHandler(async (req, res) => {
  const { buyer_name, seller_name, entryDate, entries } = req.body;
  const userId = req?.params?.userId;
  try {
    let arr = [];
    entries?.forEach((item) => {
      let obj = {
        product_name: item?.productName,
        product_quantity: item?.quantity,
        price: item?.price,
        buyer_rate: item?.buyer_percentage || 0,
        seller_rate: item?.seller_percentage || 0,
        buyer_brokerage: item?.buyerBrokerage || 0,
        seller_brokerage: item?.sellerBrokerage || 0,
        amount: item?.amount,
      };
      arr.push(obj);
    });
    const entry = await Entry.create({
      buyer_name,
      seller_name,
      entry_date: entryDate,
      lineitems: arr,
      userId,
    });
    if (entry) {
      res.status(201).json({
        data: {
          message: 'Success',
        },
      });
    } else {
      res.status(400).json({
        data: {
          message: 'failed',
        },
      });
    }
  } catch (err) {
    res.status(400);
    throw new Error('Error Occoured');
  }
});
exports.getEntryCompany = asyncHandler(async (req, res) => {
  try {
    const { company } = req.body;
    const userId = req?.params?.userId;

    let entryList = [];
    const respnse = await Entry.find({
      $and: [
        {
          $or: [{ buyer_name: company }, { seller_name: company }],
        },
        { userId: userId },
      ],
    }).sort({ entry_date: 1 });
    if (res) {
      respnse?.forEach((item) => {
        item?.lineitems.forEach((product) => {
          entryList.push({
            id: product._id,
            entryId: item?._id,
            date: item?.entry_date,
            buyer_name: item?.buyer_name,
            seller_name: item?.seller_name,
            product: product?.product_name,
            quantity: product?.product_quantity,
            price: product?.price,
            amount: product?.amount,
            brokerage:
              item?.buyer_name === company
                ? product?.buyer_brokerage
                : product?.seller_brokerage,
          });
        });
      });
    }
    // console.log(entryList)
    if (entryList.length > 0) {
      res.status(201).json({
        status: 'Success',
        results: entryList.length,
        data: {
          entryList,
        },
      });
    } else {
      res.status(201);
      res.json({
        message: 'No Entries Found!',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400);
    throw new Error('Error Occoured');
  }
});
exports.getEntryCompanyByDate = asyncHandler(async (req, res) => {
  try {
    const { company, fromDate, toDate } = req.body;
    const userId = req?.params?.userId;
    let entryList = [];
    const respnse = await Entry.find({
      $or: [{ buyer_name: company }, { seller_name: company }],
      entry_date: {
        $gte: fromDate, // Greater than or equal to fromDate
        $lte: toDate, // Less than or equal to toDate
      },
      userId: userId,
    }).sort({ entry_date: 1 });
    if (res) {
      respnse?.forEach((item) => {
        item?.lineitems.forEach((product) => {
          entryList.push({
            id: product._id,
            entryId: item?._id,
            date: item?.entry_date,
            buyer_name: item?.buyer_name,
            seller_name: item?.seller_name,
            product: product?.product_name,
            quantity: product?.product_quantity,
            price: product?.price,
            amount: product?.amount,
            brokerage:
              item?.buyer_name === company
                ? product?.buyer_brokerage
                : product?.seller_brokerage,
          });
        });
      });
    }
    // console.log(entryList)
    if (entryList.length > 0) {
      res.status(201).json({
        status: 'Success',
        results: entryList.length,
        data: {
          entryList,
        },
      });
    } else {
      res.status(201);
      res.json({
        message: 'No Entries Found!',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400);
    throw new Error('Error Occoured');
  }
});
exports.deleteEntry = asyncHandler(async (req, res) => {
  try {
    const entryId = req.params.entryId;
    const id = req.params.id;
    const userId = req?.params?.userId;
    const entry = await Entry.findOne({ _id: entryId, userId });
    if (entry) {
      const cleanEntry = JSON.parse(JSON.stringify(entry));
      const lineItems = cleanEntry?.lineitems;
      const updatedLineItems = lineItems.filter((item) => item?._id !== id);
      const updatedObj = { ...cleanEntry, lineitems: updatedLineItems };
      if (updatedObj?.lineitems?.length === 0) {
        const deletedEntry = await Entry.findOneAndDelete({
          _id: entryId,
          userId,
        });
        if (deletedEntry) {
          res.status(204).json({
            status: 'Success',
            data: null,
          });
        }
      } else {
        const deletedEntry = await Entry.findOneAndUpdate(
          { _id: entryId, userId },
          updatedObj
        );
        if (deletedEntry) {
          res.status(204).json({
            status: 'Success',
            data: null,
          });
        }
      }
    } else {
      console.log('Id not Found');
    }
  } catch (err) {
    console.log(err);
    res.status(400);
    throw new Error('Error Occoured');
  }
});
exports.getLastEntryDate = asyncHandler(async (req, res) => {
  const userId = req?.params?.userId;
  try {
    const entry = await Entry.find({ userId }).limit(1).sort({ $natural: -1 });
    if (entry) {
      res.status(201).json({
        data: {
          date: entry?.[0]?.entry_date,
        },
      });
    } else {
      res.status(400).json({
        data: {
          message: 'No Entries Found',
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400);
    throw new Error('Error Occoured');
  }
});
exports.getLastBuyer = asyncHandler(async (req, res) => {
  const userId = req?.params?.userId;
  try {
    const entry = await Entry.find({ userId }).limit(1).sort({ $natural: -1 });
    if (entry) {
      res.status(201).json({
        data: {
          buyerName: entry?.[0]?.buyer_name,
        },
      });
    } else {
      res.status(400).json({
        data: {
          message: 'No Buyer Found',
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400);
    throw new Error('Error Occoured');
  }
});
exports.getLastSeller = asyncHandler(async (req, res) => {
  const userId = req?.params?.userId;
  try {
    const entry = await Entry.find({ userId }).limit(1).sort({ $natural: -1 });
    if (entry) {
      res.status(201).json({
        data: {
          sellerName: entry?.[0]?.seller_name,
        },
      });
    } else {
      res.status(400).json({
        data: {
          message: 'No Entries Found',
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400);
    throw new Error('Error Occoured');
  }
});
exports.generateInvoice = asyncHandler(async (req, res) => {
  try {
    const company = req.params.company;
    const userId = req?.params?.userId;
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: 'new',
    });
    let entryList = [];
    const respnse = await Entry.find({
      $or: [{ buyer_name: company }, { seller_name: company }],
      userId,
    }).sort({ entry_date: 1 });

    const dateObj = new Date();
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('en-GB', options);

    if (res) {
      respnse?.forEach((item) => {
        item?.lineitems.forEach((product) => {
          entryList.push({
            id: product._id,
            entryId: item?._id,
            date: item?.entry_date,
            buyer_name: item?.buyer_name,
            seller_name: item?.seller_name,
            product: product?.product_name,
            quantity: product?.product_quantity,
            price: product?.price,
            amount: product?.amount,
            party_name:
              item?.buyer_name === company
                ? item?.seller_name
                : item?.buyer_name,
            brokerage:
              item?.buyer_name === company
                ? product?.buyer_brokerage
                : product?.seller_brokerage,
          });
        });
      });
    }
    let html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Invoice</title>
    
        <style>
          /* Reset some default styles for better cross-client consistency */
          body,
          table,
          td,
          p,
          a,
          li,
          blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            margin: 0;
            padding: 0;
          }
    
          /* Basic styling for better readability */
          body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333333;
          }
          body {
            border: 1px solid #333333;
            height: 290mm;
            width: 200mm;
            margin: 10px !important;
            padding-left: 10px !important;
            padding-right: 10px !important;
          }
          /* Style the container */
          .container {
            width: 100%;
            max-width: 760px;
            margin: 0 auto;
          }
    
          /* Style the table */
          table {
            width: 100%;
            border-collapse: collapse;
            border-spacing: 0;
            margin-bottom: 0px;
          }
    
          /* Style table header */
          th {
            /*background-color: #f2f2f2;*/
            border: 1px solid #333333;
            padding: 4px 10px 4px 10px;
            text-align: left;
          }
    
          /* Style table cells */
          td {
            border: 1px solid #333333;
            padding: 4px 10px 4px 10px;
            text-align: left;
          }
    
          /* Style links for better visibility */
          a {
            color: #007bff;
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div style="margin-top:1rem">
          <div>
            <div style="text-align: center">
              <p>|| Shree Mahaviray Namah ||</p>
              <p>Chandresh Jain</p>
              <p>612, KALANI NAGAR, AERODROME ROAD INDORE (M.P)</p>
              <p>Phone: 09827022428</p>
              <p>PAN NO - ABBPJ7941H</p>
            </div>
            <div style="display: flex; justify-content: center; margin-top: 1rem">
              <p style="text-decoration: underline">BROKERAGE BILL</p>
            </div>
            <p>BILL DATE : ${formattedDate}</p>
            <p style="text-transform: uppercase">M/S : ${company}</p>
            <div
              style="
                display: flex;
                justify-content: space-between;
                margin-top: 0.5rem;
              "
            >
              <p>Address :</p>
            </div>
          </div>
          <table style="margin-top: 1rem">
            <thead>
              <tr>
                <th>Bill Date</th>
                <th>Party Name</th>
                <th>Item</th>
                <th>Bag</th>
                <th>Rate</th>
                <th>Brokerage</th>
              </tr>
            </thead>
            <tbody style="border: 1px solid black">
              ${entryList
                .map(
                  (item) => `<tr>
                <td
                  style="
                    padding: 1px 10px;
                    border-top: none;
                    border-left: none;
                    border-bottom: none;
                    border-right: 1px solid black;
                  "
                >
                  ${formatDate(item?.date)}
                </td>
                <td
                  style="
                    padding: 1px 10px;
                    border-top: none;
                    border-left: none;
                    border-bottom: none;
                    border-right: 1px solid black;
                  "
                >
                ${item?.party_name}
                </td>
                <td
                  style="
                    padding: 1px 10px;
                    border-top: none;
                    border-left: none;
                    border-bottom: none;
                    border-right: 1px solid black;
                  "
                >
                  ${item?.product}
                </td>
                <td
                  style="
                    padding: 1px 10px;
                    border-top: none;
                    border-left: none;
                    border-bottom: none;
                    border-right: 1px solid black;
                  "
                >
                 ${item?.quantity}
                </td>
                <td
                  style="
                    padding: 1px 10px;
                    border-top: none;
                    border-left: none;
                    border-bottom: none;
                    border-right: 1px solid black;
                  "
                >
                  ${item?.price}
                </td>
                <td
                  style="
                    padding: 1px 10px;
                    border-top: none;
                    border-left: none;
                    border-bottom: none;
                    border-right: 1px solid black;
                  "
                >
                  
                ${item?.brokerage}
                </td>
              </tr>`
                )
                .join('')}                                
            </tbody>
          </table>
        </div>
      </body>
    </html>
    `;
    const page = await browser.newPage();
    await page.setContent(html);
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      format: 'A4',
      displayHeaderFooter: true,
      headerTemplate:
        '<div style="text-align: right;width: 210mm;font-size: 10px;"></div>',
      footerTemplate:
        '<div style="text-align: right;width: 210mm;font-size: 12px;"><span style="margin-right: 1cm"><span class="pageNumber"></span> of <span class="totalPages"></span></span></div>',
      margin: {
        top: '5px',
        bottom: '10px',
      },
    });

    await browser.close();
    res.setHeader('Content-Disposition', `attachment; filename=invoice_.pdf`);
    res.send(pdfBuffer);
  } catch (err) {
    console.log(err);
    res.status(400);
    throw new Error('Error Occoured');
  }
});
exports.generateInvoiceByDate = asyncHandler(async (req, res) => {
  try {
    const fromDate = req.params.fromDate;
    const toDate = req.params.toDate;
    const userId = req?.params?.userId;
    console.log(fromDate);
    console.log(toDate);
    const company = req.params.company;
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: 'new',
    });
    let entryList = [];
    const respnse = await Entry.find({
      $or: [{ buyer_name: company }, { seller_name: company }],
      entry_date: {
        $gte: fromDate, // Greater than or equal to fromDate
        $lte: toDate, // Less than or equal to toDate
      },
      userId,
    }).sort({ entry_date: 1 });

    const dateObj = new Date();
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('en-GB', options);

    if (res) {
      respnse?.forEach((item) => {
        item?.lineitems.forEach((product) => {
          entryList.push({
            id: product._id,
            entryId: item?._id,
            date: item?.entry_date,
            buyer_name: item?.buyer_name,
            seller_name: item?.seller_name,
            product: product?.product_name,
            quantity: product?.product_quantity,
            price: product?.price,
            amount: product?.amount,
            party_name:
              item?.buyer_name === company
                ? item?.seller_name
                : item?.buyer_name,
            brokerage:
              item?.buyer_name === company
                ? product?.buyer_brokerage
                : product?.seller_brokerage,
          });
        });
      });
    }
    let html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Invoice</title>
    
        <style>
          /* Reset some default styles for better cross-client consistency */
          body,
          table,
          td,
          p,
          a,
          li,
          blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            margin: 0;
            padding: 0;
          }
    
          /* Basic styling for better readability */
          body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333333;
          }
          body {
            border: 1px solid #333333;
            height: 290mm;
            width: 200mm;
            margin: 10px !important;
            padding-left: 10px !important;
            padding-right: 10px !important;
          }
          /* Style the container */
          .container {
            width: 100%;
            max-width: 760px;
            margin: 0 auto;
          }
    
          /* Style the table */
          table {
            width: 100%;
            border-collapse: collapse;
            border-spacing: 0;
            margin-bottom: 0px;
          }
    
          /* Style table header */
          th {
            /*background-color: #f2f2f2;*/
            border: 1px solid #333333;
            padding: 4px 10px 4px 10px;
            text-align: left;
          }
    
          /* Style table cells */
          td {
            border: 1px solid #333333;
            padding: 4px 10px 4px 10px;
            text-align: left;
          }
    
          /* Style links for better visibility */
          a {
            color: #007bff;
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div style="margin-top:1rem">
          <div>
            <div style="text-align: center">
              <p>|| Shree Mahaviray Namah ||</p>
              <p>Chandresh Jain</p>
              <p>612, KALANI NAGAR, AERODROME ROAD INDORE (M.P)</p>
              <p>Phone: 09827022428</p>
              <p>PAN NO - ABBPJ7941H</p>
            </div>
            <div style="display: flex; justify-content: center; margin-top: 1rem">
              <p style="text-decoration: underline">BROKERAGE BILL</p>
            </div>
            <p>BILL DATE : ${formattedDate}</p>
            <p style="text-transform: uppercase">M/S : ${company}</p>
            <div
              style="
                display: flex;
                justify-content: space-between;
                margin-top: 0.5rem;
              "
            >
              <p>Address :</p>
              <p>Bill ${formatDate(fromDate)} to ${formatDate(toDate)}</p>
            </div>
          </div>
          <table style="margin-top: 1rem">
            <thead>
              <tr>
                <th>Bill Date</th>
                <th>Party Name</th>
                <th>Item</th>
                <th>Bag</th>
                <th>Rate</th>
                <th>Brokerage</th>
              </tr>
            </thead>
            <tbody style="border: 1px solid black">
              ${entryList
                .map(
                  (item) => `<tr>
                <td
                  style="
                    padding: 1px 10px;
                    border-top: none;
                    border-left: none;
                    border-bottom: none;
                    border-right: 1px solid black;
                  "
                >
                  ${formatDate(item?.date)}
                </td>
                <td
                  style="
                    padding: 1px 10px;
                    border-top: none;
                    border-left: none;
                    border-bottom: none;
                    border-right: 1px solid black;
                  "
                >
                ${item?.party_name}
                </td>
                <td
                  style="
                    padding: 1px 10px;
                    border-top: none;
                    border-left: none;
                    border-bottom: none;
                    border-right: 1px solid black;
                  "
                >
                  ${item?.product}
                </td>
                <td
                  style="
                    padding: 1px 10px;
                    border-top: none;
                    border-left: none;
                    border-bottom: none;
                    border-right: 1px solid black;
                  "
                >
                 ${item?.quantity}
                </td>
                <td
                  style="
                    padding: 1px 10px;
                    border-top: none;
                    border-left: none;
                    border-bottom: none;
                    border-right: 1px solid black;
                  "
                >
                  ${item?.price}
                </td>
                <td
                  style="
                    padding: 1px 10px;
                    border-top: none;
                    border-left: none;
                    border-bottom: none;
                    border-right: 1px solid black;
                  "
                >
                  
                ${item?.brokerage}
                </td>
              </tr>`
                )
                .join('')}                                
            </tbody>
          </table>
        </div>
      </body>
    </html>
    `;
    const page = await browser.newPage();
    await page.setContent(html);
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      format: 'A4',
      displayHeaderFooter: true,
      headerTemplate:
        '<div style="text-align: right;width: 210mm;font-size: 10px;"></div>',
      footerTemplate:
        '<div style="text-align: right;width: 210mm;font-size: 12px;"><span style="margin-right: 1cm"><span class="pageNumber"></span> of <span class="totalPages"></span></span></div>',
      margin: {
        top: '5px',
        bottom: '10px',
      },
    });

    await browser.close();
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${req.params.company}_invoice_.pdf`
    );
    res.send(pdfBuffer);
  } catch (err) {
    console.log(err);
    res.status(400);
    throw new Error('Error Occoured');
  }
});
exports.getEntryByDate = asyncHandler(async (req, res) => {
  try {
    const entryDate = req.body.date;
    const userId = req?.params?.userId;

    console.log(entryDate);
    let entryList = [];
    const respnse = await Entry.find({
      entry_date: {
        $eq: entryDate,
      },
      userId,
    });
    console.log(respnse.length);

    res.json({
      respnse,
    });
  } catch (err) {
    console.log(err);
    res.status(400);
    throw new Error('Error Occoured');
  }
});
exports.getTotalEntries = asyncHandler(async (req, res) => {
  try {
    const userId = req?.params?.userId;

    const respnse = await Entry.find({ userId });
    console.log(respnse);
    if (respnse.length > 0) {
      res.status(201).json({
        status: 'Success',
        data: {
          noOfEntries: respnse.length,
        },
      });
    } else {
      res.status(201);
      res.json({
        message: 'No Entries Found!',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400);
    throw new Error('Error Occoured');
  }
});
exports.getAllEntriesByDate = asyncHandler(async (req, res) => {
  try {
    const userId = req?.params?.userId;

    const { fromDate, toDate } = req.body;
    let entryList = [];
    const respnse = await Entry.find({
      entry_date: {
        $gte: fromDate, // Greater than or equal to fromDate
        $lte: toDate, // Less than or equal to toDate
      },
      userId,
    }).sort({ entry_date: 1 });
    if (res) {
      respnse?.forEach((item) => {
        item?.lineitems.forEach((product) => {
          entryList.push({
            id: product._id,
            entryId: item?._id,
            date: item?.entry_date,
            buyer_name: item?.buyer_name,
            seller_name: item?.seller_name,
            product: product?.product_name,
            quantity: product?.product_quantity,
            price: product?.price,
            amount: product?.amount,
            brokerage: product?.buyer_brokerage,
          });
        });
      });
    }
    // console.log(entryList)
    if (entryList.length > 0) {
      res.status(201).json({
        status: 'Success',
        results: entryList.length,
        data: {
          entryList,
        },
      });
    } else {
      res.status(201);
      res.json({
        message: 'No Entries Found!',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400);
    throw new Error('Error Occoured');
  }
});
exports.addUserInAllDocs = asyncHandler(async (req, res) => {
  try {
    const userId = req?.params?.userId;
    const result = await Product.updateMany({}, { $set: { userId: userId } });
    console.log(result);
    res.json({result})
  } catch (err) {
    console.log(err);
    res.status(400);
    throw new Error('Error Occoured');
  }
});
