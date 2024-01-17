import { useCommtContext } from "../context/Context";
import { IndicatorProps } from "../context/reducers/appReducer";

type AvatarProps = {
  uri: string | undefined;
  width?: number | string;
  height?: number | string;
  online?: boolean;
  className?: string;
  onClick?: () => void;
};

const Avatar = ({
  uri,
  width = 60,
  height = 60,
  online = false,
  className = "",
  onClick,
}: AvatarProps) => {
  const {
    state: {
      app: {
        configs: { indicators },
      },
    },
  } = useCommtContext();

  return (
    <div onClick={onClick} className="text-start">
      <img
        src={uri}
        alt="avatar"
        className={className}
        width={width}
        height={height}
      />
      {indicators.includes(IndicatorProps.ONLINE) && online && (
        <span className="bg-success badge-dot ms-5"></span>
      )}
    </div>
  );
};

export default Avatar;
