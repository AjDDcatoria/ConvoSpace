export const Avatar = (props) => {
  return (
    <button onClick={props.func}>
      <img
        src={props.avatarLink}
        className="h-10 w-10 rounded-full image-rendering-pixelated"
        alt="Avatar"
      />
    </button>
  );
};

//   const Profile = (...props) => {
//     return (
//   <button onClick={props.func}>
//     <img
//       src={props.avatarLink}
//       className="h-10 w-10 rounded-full image-rendering-pixelated"
//       alt="Avatar"
//     />
//   </button>
//     );
//   };
//   return { Profile };
