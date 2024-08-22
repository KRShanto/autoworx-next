"use client";
import {
  Document,
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

// Create styles
const styles = StyleSheet.create({
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
    margin: 10,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: "#ccc",
    textAlign: "center",
    lineHeight: 80,
    fontSize: 24,
    color: "white",
  },
  textRight: {
    textAlign: "right",
    fontSize: 10,
  },
  boldText: {
    fontWeight: "bold",
  },
  totalContainer: {
    marginTop: 20,
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
    marginTop: 5,
  },
  materialItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  laborItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
});

const PDFComponent = ({ id, clientId, invoice, vehicle }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text>Logo</Text>
          </View>
          <View style={styles.textRight}>
            <Text style={styles.boldText}>Contact Information:</Text>
            <Text>Full Address</Text>
            <Text>Mobile Number</Text>
            <Text>Email</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.boldText, { fontSize: 20 }]}>Estimate</Text>
          <View style={styles.mainSection}>
            <View style={styles.section}>
              <Text style={styles.boldText}>Estimate To:</Text>
              <Text style={styles.fontSize10}>
                {clientId?.firstName} {clientId?.lastName}
              </Text>
              <Text style={styles.fontSize10}>{clientId?.mobile}</Text>
              <Text style={styles.fontSize10}>{clientId?.email}</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.boldText}>Vehicle Details:</Text>
              <Text style={styles.fontSize10}>{vehicle?.year}</Text>
              <Text style={styles.fontSize10}>{vehicle?.make}</Text>
              <Text style={styles.fontSize10}>{vehicle?.model}</Text>
              <Text style={styles.fontSize10}>{vehicle?.submodel}</Text>
              <Text style={styles.fontSize10}>{vehicle?.type}</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.boldText}>Estimate Details:</Text>
              <Text style={styles.fontSize10}>{invoice.id}</Text>
              <Text style={styles.fontSize10}>
                {moment(invoice.createdAt).format("MMM DD, YYYY")}
              </Text>
              <Text>Bill Status</Text>
              <Text style={styles.fontSize10}>{invoice.status?.name}</Text>
            </View>
            <View style={styles.totalContainer}>
              {[
                ["subtotal", invoice.subtotal],
                ["discount", invoice.discount],
                ["tax", invoice.tax],
                ["grand total", invoice.grandTotal],
                ["deposit", invoice.deposit],
                ["due", invoice.due],
              ].map(([key, value]) => (
                <View key={key} style={styles.total}>
                  <Text style={styles.totalLabel}>{key}</Text>
                  <Text style={styles.totalValue}>
                    ${parseFloat("" + value)?.toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <PDFInvoiceItems items={invoice.invoiceItems} />
        <PDFInvoiceItems items={invoice.invoiceItems} />
        <PDFInvoiceItems items={invoice.invoiceItems} />
        <PDFInvoiceItems items={invoice.invoiceItems} />

        <View style={styles.terms}>
          <Text style={styles.boldText}>Terms & Conditions:</Text>
          <Text>{invoice.terms}</Text>
        </View>

        <View style={styles.terms}>
          <Text style={styles.boldText}>Policy & Conditions:</Text>
          <Text>{invoice.policy}</Text>
        </View>

        <Text style={{ textAlign: "center", marginTop: 10 }}>
          Thank you for shopping with Autoworx
        </Text>
      </Page>
    </Document>
  );
};

const PDFInvoiceItems = ({ items }) => {
  return items.map((item) => {
    if (!item.service) return null;

    const materialCost = item.materials.reduce((acc, material) => {
      return (
        acc +
        (material && material.sell
          ? parseFloat(material.sell.toString()) * material.quantity -
            parseFloat(material.discount?.toString() || 0)
          : 0)
      );
    }, 0);

    const laborCost = item.labor?.charge
      ? parseFloat(item.labor?.charge.toString()) * item.labor.hours
      : 0;

    return (
      <View key={item.id} style={styles.container}>
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
                      ? parseFloat(material.sell.toString()) * material.quantity
                      : 0) - parseFloat(material.discount?.toString() || 0)
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
