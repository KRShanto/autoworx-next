"use client";
import {
  Column,
  Company,
  Invoice,
  InvoiceItem,
  InvoicePhoto,
  Labor,
  Material,
  Service,
  Status,
  User,
  Vehicle,
} from "@prisma/client";
import {
  Document,
  Font,
  Image,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import moment from "moment";
import React from "react";
import { InvoiceItems } from "./InvoiceItems";
// Register Poppins Regular
Font.register({
  family: "Poppins",
  src: "/fonts/Poppins-Regular.ttf",
  fontWeight: "normal",
});

// Register Poppins Italic
Font.register({
  family: "Poppins",
  src: "/fonts/Poppins-Italic.ttf",
  fontWeight: "normal",
  fontStyle: "italic",
});

// Register Poppins Thin
Font.register({
  family: "Poppins",
  src: "/fonts/Poppins-Thin.ttf",
  fontWeight: 100,
});

// Register Poppins Thin Italic
Font.register({
  family: "Poppins",
  src: "/fonts/Poppins-ThinItalic.ttf",
  fontWeight: 100,
  fontStyle: "italic",
});

// Register Poppins Light
Font.register({
  family: "Poppins",
  src: "/fonts/Poppins-Light.ttf",
  fontWeight: 300,
});

// Register Poppins Light Italic
Font.register({
  family: "Poppins",
  src: "/fonts/Poppins-LightItalic.ttf",
  fontWeight: 300,
  fontStyle: "italic",
});

// Register Poppins Medium
Font.register({
  family: "Poppins",
  src: "/fonts/Poppins-Medium.ttf",
  fontWeight: 500,
});

// Register Poppins Medium Italic
Font.register({
  family: "Poppins",
  src: "/fonts/Poppins-MediumItalic.ttf",
  fontWeight: 500,
  fontStyle: "italic",
});

// Register Poppins SemiBold
Font.register({
  family: "Poppins",
  src: "/fonts/Poppins-SemiBold.ttf",
  fontWeight: 600,
});

// Register Poppins SemiBold Italic
Font.register({
  family: "Poppins",
  src: "/fonts/Poppins-SemiBoldItalic.ttf",
  fontWeight: 600,
  fontStyle: "italic",
});

// Register Poppins Bold
Font.register({
  family: "Poppins",
  src: "/fonts/Poppins-Bold.ttf",
  fontWeight: "bold",
});

// Register Poppins Bold Italic
Font.register({
  family: "Poppins",
  src: "/fonts/Poppins-BoldItalic.ttf",
  fontWeight: "bold",
  fontStyle: "italic",
});

// Register Poppins ExtraBold
Font.register({
  family: "Poppins",
  src: "/fonts/Poppins-ExtraBold.ttf",
  fontWeight: 800,
});

// Register Poppins ExtraBold Italic
Font.register({
  family: "Poppins",
  src: "/fonts/Poppins-ExtraBoldItalic.ttf",
  fontWeight: 800,
  fontStyle: "italic",
});

// Create styles
const styles = StyleSheet.create({
  regular: {
    fontFamily: "Poppins",
  },
  italic: {
    fontFamily: "Poppins",
    fontStyle: "italic",
  },
  bold: {
    fontFamily: "Poppins",
    fontWeight: "bold",
  },
  boldItalic: {
    fontFamily: "Poppins",
    fontWeight: "bold",
    fontStyle: "italic",
  },
  extraBold: {
    fontFamily: "Poppins",
    fontWeight: 800,
  },
  lightItalic: {
    fontFamily: "Poppins",
    fontWeight: 300,
    fontStyle: "italic",
  },
  page: {
    padding: 20,
  },
  container: {
    borderWidth: 1,
    borderColor: "#6571FF",
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  mainSection: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    fontSize: 10,
  },
  fontSize10: {
    fontSize: 10,
  },
  section: {
    // margin: 10,
    // padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  logo: {
    // width: 80,
    // height: 80,
  },
  textRight: {
    textAlign: "right",
    fontSize: 10,
  },
  boldText: {
    fontWeight: "bold",
  },
  totalContainer: {
    // marginTop: 20,
  },
  total: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#6571FF",
    marginBottom: 1,
    borderRadius: 4,
    columnGap: 2,
  },
  totalLabel: {
    fontWeight: "bold",
    color: "#6571FF",
    paddingLeft: 2,
    textTransform: "uppercase",
  },
  totalValue: {
    backgroundColor: "#6571FF",
    color: "white",
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  invoiceItems: {
    marginTop: 20,
  },
  terms: {
    marginTop: 20,
    fontSize: 10,
  },
  authorize: {
    marginTop: 20,
    backgroundColor: "#6571FF",
    color: "white",
    textAlign: "center",
    padding: 10,
  },
  itemText: {
    color: "#6571FF",
  },
  serviceDetails: {
    // marginTop: 5,
  },
  mainMaterial: {
    color: "#6571FF",
    fontSize: 10,
  },
  materialItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 5,
  },
  laborItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    marginLeft: 5,
  },
});

const PDFComponent = ({
  id,
  clientId,
  invoice,
  vehicle,
}: {
  id: string;
  clientId: any;
  invoice: Invoice & {
    column: Column | null;
    company: Company;
    invoiceItems: (InvoiceItem & {
      materials: Material[] | [];
      service: Service | null;
      invoice: Invoice | null;
      labor: Labor | null;
    })[];
    photos: InvoicePhoto[];
    user: User;
  };
  vehicle: Vehicle | null;
}) => {
  return (
    <Document>
      <Page
        size="A4"
        style={[styles.page, styles.regular, { color: "#64748b" }]}
      >
        <View style={styles.header}>
          <View style={styles.logo}>
            <Image
              src="https://png.pngtree.com/png-vector/20220807/ourmid/pngtree-man-avatar-wearing-gray-suit-png-image_6102786.png"
              style={{
                width: 100,
                height: 100,
              }}
              // @ts-ignore
              alt="logo"
            />
          </View>
          <View style={styles.textRight}>
            <Text style={styles.boldText}>Contact Information:</Text>
            <Text>Full Address</Text>
            <Text>Mobile Number</Text>
            <Text>Email</Text>
          </View>
        </View>

        <View style={[styles.section, { marginBottom: 20, marginTop: 20 }]}>
          <Text style={[styles.boldText, { fontSize: 20 }]}>Estimate</Text>
          <View style={[styles.mainSection, { marginTop: 20 }]}>
            <View style={{}}>
              <Text style={[styles.boldText, { marginBottom: 2 }]}>
                Estimate To:
              </Text>
              <Text style={styles.fontSize10}>
                {clientId?.firstName} {clientId?.lastName}
              </Text>
              <Text style={styles.fontSize10}>{clientId?.mobile}</Text>
              <Text style={styles.fontSize10}>{clientId?.email}</Text>
            </View>
            <View style={styles.section}>
              <Text style={[styles.boldText, { marginBottom: 2 }]}>
                Vehicle Details:
              </Text>
              <Text style={styles.fontSize10}>{vehicle?.year}</Text>
              <Text style={styles.fontSize10}>{vehicle?.make}</Text>
              <Text style={styles.fontSize10}>{vehicle?.model}</Text>
              <Text style={styles.fontSize10}>{vehicle?.submodel}</Text>
              <Text style={styles.fontSize10}>{vehicle?.type}</Text>
            </View>
            <View style={styles.section}>
              <Text style={[styles.boldText, { marginBottom: 2 }]}>
                Estimate Details:
              </Text>
              <Text style={styles.fontSize10}>{invoice.id}</Text>
              <Text style={styles.fontSize10}>
                {moment(invoice.createdAt).format("MMM DD, YYYY")}
              </Text>
              <Text>Bill Status</Text>
              <Text style={styles.fontSize10}>{invoice.column?.title}</Text>
            </View>
            <View style={styles.totalContainer}>
              {[
                ["subtotal", invoice.subtotal],
                ["discount", invoice.discount],
                ["tax", invoice.tax],
                ["grand total", invoice.grandTotal],
                ["deposit", invoice.deposit],
                ["due", invoice.due],
              ].map(([field, value], ind) => (
                <View key={ind} style={styles.total}>
                  {/* @ts-ignore */}
                  <Text style={styles.totalLabel}>{field || ""}</Text>
                  <Text style={styles.totalValue}>
                    ${parseFloat("" + value)?.toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <PDFInvoiceItems items={invoice.invoiceItems} />

        <View style={styles.terms}>
          <Text style={styles.boldText}>Terms & Conditions:</Text>
          <Text>{invoice.terms}</Text>
        </View>

        <View style={styles.terms}>
          <Text style={styles.boldText}>Policy & Conditions:</Text>
          <Text>{invoice.policy}</Text>
        </View>

        <Text style={{ textAlign: "center", marginTop: 30 }}>
          Thank you for shopping with Autoworx
        </Text>
      </Page>
    </Document>
  );
};

const PDFInvoiceItems = ({
  items,
}: {
  items: (InvoiceItem & {
    materials: Material[] | [];
    service: Service | null;
    invoice: Invoice | null;
    labor: Labor | null;
  })[];
}) => {
  return items.map((item) => {
    if (!item.service) return null;

    const materialCost = item.materials.reduce((acc, material) => {
      return (
        acc +
        (material && material.sell
          ? parseFloat(material.sell.toString()) * (material.quantity ?? 0) -
            parseFloat(material.discount ? material.discount.toString() : "0")
          : 0)
      );
    }, 0);

    const laborCost = item.labor?.charge
      ? parseFloat(item.labor?.charge.toString()) * (item.labor.hours ?? 0)
      : 0;

    return (
      <View
        key={item.id}
        style={{
          ...styles.container,
          ...styles.mainMaterial,
        }}
      >
        <View style={styles.header}>
          <Text>{item.service.name}</Text>
          <Text>${(materialCost + laborCost).toFixed(2)}</Text>
        </View>

        <View style={styles.serviceDetails}>
          {item.materials.map((material, index) => {
            if (!material) return null;

            return (
              <View key={index} style={styles.materialItem}>
                <Text>{material.name}</Text>
                <Text>
                  $
                  {(
                    (material.sell
                      ? parseFloat(material.sell.toString()) *
                        (material.quantity ?? 0)
                      : 0) -
                    parseFloat(
                      material.discount ? material.discount.toString() : "0",
                    )
                  ).toFixed(2)}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.laborItem}>
          <Text>{item.labor ? item.labor.name : "Labor"}</Text>
          <Text>${laborCost.toFixed(2)}</Text>
        </View>
      </View>
    );
  });
};

export default PDFComponent;
