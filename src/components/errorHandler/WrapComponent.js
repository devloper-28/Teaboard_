// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";

// const withCommonData = (Component, fetchAction) => {
//   const WrappedComponent = (props) => {
//     const dispatch = useDispatch();
//     const { error } = useSelector((state) => state);

//     useEffect(() => {
//       dispatch(fetchAction());
//     }, [dispatch, fetchAction]);

//     // if (loading) {
//     //   return <div>Loading...</div>; // You can show a loading spinner or component here
//     // }

//     if (error) {
//       return <div>Error: {error}</div>; // Display the error message if the API call failed
//     }

//     // Pass the fetched data as a prop to the wrapped component
//     return <Component {...props} />;
//   };

//   return WrappedComponent;
// };

// export default withCommonData;
