declare module "react-native-pager-view" {
  import * as React from "react";
  import { ViewProps, NativeSyntheticEvent } from "react-native";

  export interface PagerViewOnPageSelectedEventData {
    position: number;
  }

  export interface PagerViewProps extends ViewProps {
    initialPage?: number;
    scrollEnabled?: boolean;
    onPageSelected?: (
      e: NativeSyntheticEvent<PagerViewOnPageSelectedEventData>
    ) => void;
  }

  export default class PagerView extends React.Component<PagerViewProps> {
    setPage(index: number): void;
  }
}
