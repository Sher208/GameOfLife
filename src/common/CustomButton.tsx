import React from 'react';

type CustomButtonProps = {
	className?: string;
	isSelected?: boolean;
	children?: React.ReactNode;
	onClick: (...args: any) => void;
};

const CustomButton: React.FC<CustomButtonProps> = ({
	className,
	children,
	onClick
}) => {
	return (
		<button className={className} onClick={onClick}>
			{children}
		</button>
	);
};

export default CustomButton;
