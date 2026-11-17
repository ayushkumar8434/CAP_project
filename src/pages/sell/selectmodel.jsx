const modelsByBrand = {
	Apple: ['iPhone 16', 'iPhone 15', 'iPhone 14', 'iPhone 13'],
	Samsung: ['Galaxy S25', 'Galaxy S24', 'Galaxy A55', 'Galaxy A35'],
	Google: ['Pixel 9', 'Pixel 9a', 'Pixel 8', 'Pixel 8a'],
	OnePlus: ['OnePlus 13', 'OnePlus 12', 'Nord 4', 'Nord CE4'],
	Xiaomi: ['Xiaomi 14', 'Redmi Note 14 Pro', 'Redmi Note 13 Pro', 'Redmi 13'],
	Vivo: ['Vivo V40', 'Vivo V30', 'Vivo T3', 'Vivo Y28'],
	Oppo: ['Oppo Reno 12', 'Oppo Reno 11', 'Oppo F27', 'Oppo A3 Pro'],
}

function SelectModel({ brand, selectedModel, onSelect, onNext, onBack }) {
	const models = modelsByBrand[brand] ?? []

	return (
		<section className="sell-brand-step">
			<div className="sell-section-heading">
				<h2>Which {brand} model do you have?</h2>
				<p>Choose the model that matches your phone.</p>
			</div>

			<div className="sell-model-grid">
				{models.map((model) => (
					<button
						key={model}
						type="button"
						className={`sell-model-option${selectedModel === model ? ' is-selected' : ''}`}
						aria-pressed={selectedModel === model}
						onClick={() => onSelect(model)}
					>
						<span>{model}</span>
						<span className="sell-model-indicator">
							{selectedModel === model ? 'Selected' : ''}
						</span>
					</button>
				))}
			</div>

			<div className="sell-step-footer">
				<button className="sell-back-button" type="button" onClick={onBack}>
					Back
				</button>
				<p>{selectedModel || 'Choose a model to continue'}</p>
				<button
					className="sell-next-button"
					type="button"
					onClick={onNext}
					disabled={!selectedModel}
				>
					Continue
				</button>
			</div>
		</section>
	)
}

export default SelectModel
