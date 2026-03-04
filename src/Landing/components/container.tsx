export const Container: React.FC<{
	children: React.ReactNode;
	className?: string;
	fullWidth?: boolean;
}> = ({ children, className = "", fullWidth = false }) => {
	return fullWidth ? (
		<div className={`w-full ${className}`}>{children}</div>
	) : (
		<div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
			{children}
		</div>
	);
};
