import moment from "moment";
import {useEffect, useState, useMemo} from "react";
import {
  CheckLg,
  XLg,
  ThreeDots,
  Check2All,
  CheckCircle,
  ExclamationTriangle,
  InfoCircle,
  MenuButtonFill,
  Check2Square
} from 'react-bootstrap-icons';
import {Container, Row, Col, Table} from 'react-bootstrap';
import Statistics from '../Statistics/Statistics';
import Spinner from '../Spinner/Spinner';
import MockApi from '../../api/mockApi';
import styles from './dashboard.module.css';

const mockApi = new MockApi();
const tableHeaders = new Map([
  ["createdAt", "Created"],
  ["name", "Name"],
  ["type", "Type"],
  ["riskScore", "Risk Score"],
  ["status", "Status"],
]);

function Dashboard() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    (
            async () => {
              setIsLoading(true);
              const reports = await mockApi.getReports();
              setReports(reports);
              setIsLoading(false);
            })();
  }, []);
  
  
  const headers = useMemo(() => Array.from(tableHeaders.values()).map((header) => <th key={header}>{header}</th>), [])
  
  const statuses = useMemo(() => (
          {
            approved: <><CheckLg className={`${styles.approvedIcon} ${styles.icon}`}/> Approved</>,
            processing: <><ThreeDots className={`${styles.processingIcon} ${styles.icon}`}/> Customer Processing</>,
            accepted: <><Check2All className={`${styles.acceptedIcon} ${styles.icon}`}/> User Accepted KYC
              Invitation</>,
            rejected: <><XLg className={`${styles.rejectedIcon} ${styles.icon}`}/> User Rejected KYC Invitation</>,
            cancelled: <><XLg className={`${styles.cancelledIcon} ${styles.icon}`}/> Cancelled</>,
            ready: <><Check2Square className={`${styles.readyIcon} ${styles.icon}`}/> Ready For Review</>
          }), []);
  
  const riskScores = useMemo(() => (
          {
            0: <><CheckCircle className={styles.icon}/> <span className={styles.lowRiskIcon}>LOW</span></>,
            1: <><InfoCircle className={styles.icon}/> <span className={styles.mediumRiskIcon}>MEDIUM</span></>,
            2: <><ExclamationTriangle className={styles.icon}/> <span className={styles.highRiskIcon}>HIGH</span></>,
          }), []);
  
  const rows = useMemo(() => reports.map((report) => (
          <tr key={report.id}>
            {Array.from(tableHeaders.keys()).map((key) => {
              let value = report[key];
              if (key === "riskScore") {
                value = riskScores[value] || 'Not Calculated';
              }
              else if (key === "status") {
                value = <div className={`${styles.status} me-2`}><span>{statuses[value] || 'Unknown'}</span>
                  <MenuButtonFill/></div>
              }
              else if (key === "createdAt") {
                const date = moment(new Date(value));
                value = <>
                  <div>{date.format('MMMM D, YYYY')}</div>
                  <div className={styles.subText}>{date.format('HH:mm:ss')}</div>
                </>
              }
              else if (key === "name") {
                value = <>
                  <div>{report.name}</div>
                  <div className={styles.subText}>{report.email}</div>
                </>
              }
              
              return <td key={key}>{value}</td>;
              
            })}
          </tr>
  )), [reports]);
  
  return (
          <Container>
            <Row>
              <Col sm={12}>
                <h1>Dashboard</h1>
                <div className={styles.reportsContainer}>
                  <h3>KYC Application Reports</h3>
                  {isLoading ?
                          <Spinner/> :
                          <Row className="justify-content-center">
                            <Col sm={12} md={6}>
                              <div className="d-flex justify-content-center m-2">
                                <Statistics data={reports}/>
                              </div>
                            </Col>
                            <Col sm={12}>
                              <Table striped hover className={styles.reportsTable}>
                                <thead>
                                <tr>
                                  {headers}
                                </tr>
                                </thead>
                                <tbody>
                                {rows}
                                </tbody>
                              </Table>
                            </Col>
                          </Row>
                  }
                
                </div>
              </Col>
            </Row>
          </Container>
  );
}

export default Dashboard;
