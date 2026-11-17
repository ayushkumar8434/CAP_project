const conditions = [
	{
		name: 'Like New',
		description: 'Looks almost unused, with no noticeable damage.',
	},
	{
		name: 'Good',
		description: 'Works properly and has only minor signs of use.',
	},
	{
		name: 'Fair',
		description: 'Works properly, but has visible scratches or wear.',
	},
	{
		name: 'Needs Repair',
		description: 'Has damage or a feature that does not work properly.',
	},
]

function SelectCondition({ selectedCondition, onSelect, onNext, onBack }) {
	return (
		<section className="sell-brand-step">
			<div className="sell-section-heading">
				<h2>What condition is your phone in?</h2>
				<p>Choose the option that best describes its current condition.</p>
			</div>

			<div className="sell-condition-grid">
				{conditions.map((condition) => (
					<button
						key={condition.name}
						type="button"
						className={`sell-condition-option${selectedCondition === condition.name ? ' is-selected' : ''}`}
						aria-pressed={selectedCondition === condition.name}
						onClick={() => onSelect(condition.name)}
					>
						<span className="sell-condition-name">{condition.name}</span>
						<span className="sell-condition-description">{condition.description}</span>
					</button>
				))}
			</div>

			<div className="sell-step-footer">
				<button className="sell-back-button" type="button" onClick={onBack}>
					Back
				</button>
				<p>{selectedCondition || 'Choose a condition to continue'}</p>
				<button
					className="sell-next-button"
					type="button"
					onClick={onNext}
					disabled={!selectedCondition}
				>
					Continue
				</button>
			</div>
		</section>
	)
}

export default SelectCondition
