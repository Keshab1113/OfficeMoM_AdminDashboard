import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Star, Check, X } from 'lucide-react';
import { pricingService } from '../services/api';

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const response = await pricingService.getPlans();
      setPlans(response.data);
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (planId) => {
    if (window.confirm('Are you sure you want to delete this pricing plan?')) {
      try {
        await pricingService.deletePlan(planId);
        loadPlans();
      } catch (error) {
        console.error('Error deleting plan:', error);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingPlan) {
        await pricingService.updatePlan(editingPlan.id, formData);
      } else {
        await pricingService.createPlan(formData);
      }
      setShowForm(false);
      setEditingPlan(null);
      loadPlans();
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  };

  const FeatureItem = ({ feature, included }) => (
    <div className="flex items-center space-x-3">
      {included ? (
        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
      ) : (
        <X className="h-5 w-5 text-gray-300 flex-shrink-0" />
      )}
      <span className={included ? 'text-gray-700' : 'text-gray-400'}>{feature}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pricing Plans</h1>
          <p className="text-gray-600">Manage subscription plans and pricing</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Plan
        </button>
      </div>

      {/* Pricing Plans Grid */}
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 p-6 ${
                plan.is_highlighted
                  ? 'border-blue-500 bg-primary-50 scale-105 shadow-xl'
                  : 'border-gray-200 bg-white shadow-lg'
              } transition-transform`}
            >
              {/* Popular Badge */}
              {plan.is_popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Highlighted Badge */}
              {plan.is_highlighted && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Featured
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                {plan.yearly_price && (
                  <p className="text-sm text-gray-500 mt-1">
                    ${plan.yearly_price}/year (save {Math.round((1 - plan.yearly_price / (plan.price * 12)) * 100)}%)
                  </p>
                )}
              </div>

              {plan.description && (
                <p className="text-gray-600 text-center mb-6">{plan.description}</p>
              )}

              {/* Features */}
              <div className="space-y-3 mb-6">
                <div className="text-sm text-gray-500">
                  {plan.monthly_minutes} minutes/month
                </div>
                
                {plan.features && Array.isArray(plan.features) && plan.features.map((feature, index) => (
                  <FeatureItem key={index} feature={feature} included={true} />
                ))}

                {plan.extra_minute_cost && (
                  <div className="text-sm text-gray-600 mt-3">
                    Extra minutes: ${plan.extra_minute_cost}/min
                  </div>
                )}

                {plan.per_file_minutes_limit && (
                  <div className="text-sm text-gray-600">
                    Per file limit: {plan.per_file_minutes_limit} min
                  </div>
                )}

                {plan.total_lifetime_minutes && (
                  <div className="text-sm text-gray-600">
                    Lifetime minutes: {plan.total_lifetime_minutes}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingPlan(plan);
                    setShowForm(true);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(plan.id)}
                  className="flex-1 bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Plan Form Modal */}
      {showForm && (
        <PricingForm
          plan={editingPlan}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingPlan(null);
          }}
        />
      )}
    </div>
  );
}

function PricingForm({ plan, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    name: plan?.name || '',
    price: plan?.price || 0,
    priceID: plan?.priceID || '',
    yearly_price: plan?.yearly_price || 0,
    yearly_priceID: plan?.yearly_priceID || '',
    monthly_minutes: plan?.monthly_minutes || 0,
    description: plan?.description || '',
    features: plan?.features || [],
    button_text: plan?.button_text || 'Get Started',
    is_highlighted: plan?.is_highlighted || false,
    is_popular: plan?.is_popular || false,
    extra_minute_cost: plan?.extra_minute_cost || 0,
    requires_recharge: plan?.requires_recharge || false,
    per_file_minutes_limit: plan?.per_file_minutes_limit || 0,
    per_meeting_minutes_limit: plan?.per_meeting_minutes_limit || 0,
    total_lifetime_minutes: plan?.total_lifetime_minutes || 0
  });

  const [featureInput, setFeatureInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {plan ? 'Edit Pricing Plan' : 'Add New Pricing Plan'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plan Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Basic, Pro, Enterprise"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Yearly Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.yearly_price}
                onChange={(e) => setFormData({ ...formData, yearly_price: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Minutes *
              </label>
              <input
                type="number"
                required
                value={formData.monthly_minutes}
                onChange={(e) => setFormData({ ...formData, monthly_minutes: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Plan description"
            />
          </div>

          {/* Features Management */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Features
            </label>
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add a feature"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                  <span>{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Extra Minute Cost ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.extra_minute_cost}
                onChange={(e) => setFormData({ ...formData, extra_minute_cost: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Per File Minutes Limit
              </label>
              <input
                type="number"
                value={formData.per_file_minutes_limit}
                onChange={(e) => setFormData({ ...formData, per_file_minutes_limit: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Lifetime Minutes
              </label>
              <input
                type="number"
                value={formData.total_lifetime_minutes}
                onChange={(e) => setFormData({ ...formData, total_lifetime_minutes: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_highlighted"
                checked={formData.is_highlighted}
                onChange={(e) => setFormData({ ...formData, is_highlighted: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_highlighted" className="ml-2 block text-sm text-gray-900">
                Highlighted Plan
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_popular"
                checked={formData.is_popular}
                onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_popular" className="ml-2 block text-sm text-gray-900">
                Most Popular
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="requires_recharge"
                checked={formData.requires_recharge}
                onChange={(e) => setFormData({ ...formData, requires_recharge: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="requires_recharge" className="ml-2 block text-sm text-gray-900">
                Requires Recharge
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {plan ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}