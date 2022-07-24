import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './DropZone.module.scss';

type DropZoneProps = {
	name?: string;
};

const DropZone: React.FC<DropZoneProps> = () => {
	const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
		accept: {
			'text/plain': []
		}
	});

	return (
		<section className="container">
			<div
				{...getRootProps({
					className: `${styles.DropZone__Container}`
				})}
			>
				<input {...getInputProps()} />
				<p>Select Files</p>
			</div>
			<aside>
				<h4>Accepted files</h4>
				<ul>
					{acceptedFiles.map((file: any) => (
						<li key={file.path}>
							{file.path} - {file.size} bytes
						</li>
					))}
				</ul>
			</aside>
		</section>
	);
};

export default DropZone;
