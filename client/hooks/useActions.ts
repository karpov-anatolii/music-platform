import { albumActions } from "@/store/album/album.slice";
import { playerActions } from "@/store/player/player.slice";
import { userActions } from "@/store/user/user.slice";
import { bindActionCreators } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

const allActions = {
  ...playerActions,
  ...albumActions,
  ...userActions,
};

export const useActions = () => {
  const dispatch = useDispatch();
  return bindActionCreators(allActions, dispatch); //bindActionCreators берет в себя (actionCreator: ActionCreator<unknown>, dispatch: Dispatch<AnyAction>)
};
