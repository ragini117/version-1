import React from "react";
import ReactPaginate from "react-paginate";
import styles from "../../components/dashboardLayout/dashbordLayout.module.css";
const index = ({ pagination, handlePageClick }) => {
  const pageCount = pagination.totalPages;
  const currentPage = pagination.currentPage - 1;
  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel=">>"
      onPageChange={handlePageClick}
      pageRangeDisplayed={1}
      pageCount={pageCount}
      previousLabel="<<"
      marginPagesDisplayed={2}
      renderOnZeroPageCount={null}
      forcePage={currentPage ? currentPage : null}
      containerClassName={`pagination ${styles.pagination_nav}`}
      pageClassName={`page-item ${styles.page_item_cus}`}
      pageLinkClassName={`page-link ${styles.page_link_nav}`}
      previousClassName={`page-item ${styles.page_item_cus}`}
      previousLinkClassName={`page-link ${styles.navprev}`}
      nextClassName={`page-item ${styles.page_item_cus}`}
      nextLinkClassName={`page-link ${styles.next}`}
      breakClassName={`page-item ${styles.page_item_cus}`}
      breakLinkClassName={`page-link ${styles.page_link_nav}`}
      activeClassName={`${styles.page_active}`}
    />
  );
};

export default index;
