import { motion } from 'framer-motion';
import { FiTrendingUp } from 'react-icons/fi';

/**
 * Animated stats card for dashboard
 */
export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = '#7c3aed',
  trend,
  loading = false,
}) {
  if (loading) {
    return (
      <div className="glass-card p-5">
        <div className="skeleton h-4 w-20 mb-3" />
        <div className="skeleton h-8 w-28 mb-2" />
        <div className="skeleton h-3 w-16" />
      </div>
    );
  }

  return (
    <motion.div
      className="glass-card p-5 relative overflow-hidden cursor-default"
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Background glow */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10"
        style={{ background: `radial-gradient(circle, ${color}, transparent)` }}
      />

      <div className="flex items-start justify-between mb-3">
        <div
          className="p-2.5 rounded-12 flex items-center justify-center"
          style={{
            background: `${color}20`,
            border: `1px solid ${color}40`,
          }}
        >
          {Icon && <Icon size={20} style={{ color }} />}
        </div>

        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            <FiTrendingUp size={12} style={{ transform: trend < 0 ? 'rotate(180deg)' : 'none' }} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div className="text-2xl font-bold mb-1" style={{ color }}>
        {value}
      </div>
      <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
        {title}
      </div>
      {subtitle && (
        <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          {subtitle}
        </div>
      )}
    </motion.div>
  );
}
