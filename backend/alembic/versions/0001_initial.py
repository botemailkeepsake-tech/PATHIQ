"""initial migration

Revision ID: 0001_initial
Revises: 
Create Date: 2025-01-15 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from pgvector.sqlalchemy import Vector

# revision identifiers, used by Alembic.
revision = '0001_initial'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Enable pgvector extension first (required for Vector type)
    op.execute('CREATE EXTENSION IF NOT EXISTS vector;')

    # Create enum types first (on a clean database, no checkfirst needed)
    enum_definitions = [
        ("sourcetypeenum", ['official_notification', 'government_report', 'survey', 'institutional', 'other']),
        ("knowledgetopicenum", ['job_security', 'income', 'social_perception', 'safety', 'degree_foreclosure', 'progression', 'scheme', 'provider', 'trade_profile', 'local_opportunity']),
        ("geographylevelenum", ['district', 'state', 'national']),
        ("recordstatusenum", ['verified', 'needs_review', 'expired', 'conflicting', 'withdrawn']),
        ("sessionstatusenum", ['active', 'summarised', 'handed_off', 'closed']),
        ("consentkindenum", ['session', 'counsellor_handoff', 'anonymised_research']),
        ("consenterroleenum", ['parent', 'guardian']),
        ("consentmethodenum", ['typed_confirmation', 'otp', 'counsellor_witnessed']),
        ("speakerroleenum", ['student', 'parent', 'system']),
        ("safetyflagenum", ['none', 'distress']),
        ("concernlabelenum", ['job_security', 'income', 'social_perception', 'safety', 'degree_foreclosure']),
        ("concernstatusenum", ['open', 'partly_resolved', 'resolved']),
        ("handoffreasonenum", ['outside_knowledge', 'repeated_confusion', 'distress', 'unresolved_disagreement', 'requested', 'evidence_conflict', 'case_specific']),
        ("handoffstatusenum", ['pending', 'accepted', 'completed']),
    ]

    for enum_name, enum_values in enum_definitions:
        enum_type = sa.Enum(*enum_values, name=enum_name)
        enum_type.create(op.get_bind(), checkfirst=False)

    # Create sources table
    op.create_table(
        'sources',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('title', sa.Text(), nullable=False),
        sa.Column('authority', sa.Text(), nullable=False),
        sa.Column('source_type', sa.Enum('official_notification', 'government_report', 'survey', 'institutional', 'other', name='sourcetypeenum', create_type=False), nullable=False),
        sa.Column('url', sa.Text(), nullable=True),
        sa.Column('document_ref', sa.Text(), nullable=True),
        sa.Column('published_date', sa.Date(), nullable=True),
        sa.Column('retrieved_date', sa.Date(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    # Create knowledge_records table
    op.create_table(
        'knowledge_records',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('topic', sa.Enum('job_security', 'income', 'social_perception', 'safety', 'degree_foreclosure', 'progression', 'scheme', 'provider', 'trade_profile', 'local_opportunity', name='knowledgetopicenum', create_type=False), nullable=False),
        sa.Column('trade', sa.Text(), nullable=True),
        sa.Column('claim', sa.Text(), nullable=False),
        sa.Column('value', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('source_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('geography_level', sa.Enum('district', 'state', 'national', name='geographylevelenum', create_type=False), nullable=False),
        sa.Column('geography_code', sa.Text(), nullable=False),
        sa.Column('applicability', sa.Text(), nullable=False),
        sa.Column('language_variants', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('published_date', sa.Date(), nullable=True),
        sa.Column('verified_date', sa.Date(), nullable=False),
        sa.Column('review_due', sa.Date(), nullable=False),
        sa.Column('status', sa.Enum('verified', 'needs_review', 'expired', 'conflicting', 'withdrawn', name='recordstatusenum', create_type=False), nullable=False, server_default='needs_review'),
        sa.Column('is_demo', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('embedding', Vector(1536), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['source_id'], ['sources.id'], ondelete='RESTRICT'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_knowledge_records_topic_trade_geo_status', 'knowledge_records', ['topic', 'trade', 'geography_level', 'geography_code', 'status'], unique=False)
    op.create_check_constraint('ck_verified_before_review_due', 'knowledge_records', 'verified_date <= review_due')
    op.create_check_constraint('ck_valid_status', 'knowledge_records', "status IN ('verified', 'needs_review', 'expired', 'conflicting', 'withdrawn')")

    # Create progression_edges table
    op.create_table(
        'progression_edges',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('from_node', sa.Text(), nullable=False),
        sa.Column('to_node', sa.Text(), nullable=False),
        sa.Column('record_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('eligibility', sa.Text(), nullable=False),
        sa.Column('conditions', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['record_id'], ['knowledge_records.id'], ondelete='RESTRICT'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('from_node', 'to_node', 'record_id', name='uq_progression_edge')
    )
    op.create_index('ix_progression_edges_from_node', 'progression_edges', ['from_node'], unique=False)
    op.create_index('ix_progression_edges_to_node', 'progression_edges', ['to_node'], unique=False)

    # Create sessions table
    op.create_table(
        'sessions',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('language', sa.Text(), nullable=False),
        sa.Column('pilot_region', sa.Text(), nullable=False),
        sa.Column('trade_of_interest', sa.Text(), nullable=True),
        sa.Column('status', sa.Enum('active', 'summarised', 'handed_off', 'closed', name='sessionstatusenum', create_type=False), nullable=False, server_default='active'),
        sa.Column('retention_until', sa.Date(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    # Create consents table
    op.create_table(
        'consents',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('session_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('kind', sa.Enum('session', 'counsellor_handoff', 'anonymised_research', name='consentkindenum', create_type=False), nullable=False),
        sa.Column('granted', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('consenter_role', sa.Enum('parent', 'guardian', name='consenterroleenum', create_type=False), nullable=False),
        sa.Column('method', sa.Enum('typed_confirmation', 'otp', 'counsellor_witnessed', name='consentmethodenum', create_type=False), nullable=False),
        sa.Column('timestamp', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('language_shown', sa.Text(), nullable=False),
        sa.Column('version_of_text', sa.Text(), nullable=False),
        sa.ForeignKeyConstraint(['session_id'], ['sessions.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # Create messages table
    op.create_table(
        'messages',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('session_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('speaker_role', sa.Enum('student', 'parent', 'system', name='speakerroleenum', create_type=False), nullable=False),
        sa.Column('text', sa.Text(), nullable=False),
        sa.Column('language', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('safety_flag', sa.Enum('none', 'distress', name='safetyflagenum', create_type=False), nullable=False, server_default='none'),
        sa.ForeignKeyConstraint(['session_id'], ['sessions.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_messages_session_created', 'messages', ['session_id', 'created_at'], unique=False)

    # Create concerns table
    op.create_table(
        'concerns',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('session_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('message_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('label', sa.Enum('job_security', 'income', 'social_perception', 'safety', 'degree_foreclosure', name='concernlabelenum', create_type=False), nullable=False),
        sa.Column('confidence', sa.Float(), nullable=False),
        sa.Column('confirmed', sa.Boolean(), nullable=True),
        sa.Column('status', sa.Enum('open', 'partly_resolved', 'resolved', name='concernstatusenum', create_type=False), nullable=False, server_default='open'),
        sa.Column('resolved_by_evidence_ids', postgresql.ARRAY(postgresql.UUID(as_uuid=True)), nullable=False, server_default='{}'),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['message_id'], ['messages.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['session_id'], ['sessions.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_concerns_session_status', 'concerns', ['session_id', 'status'], unique=False)

    # Create concern_corrections table
    op.create_table(
        'concern_corrections',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('concern_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('original_label', sa.Enum('job_security', 'income', 'social_perception', 'safety', 'degree_foreclosure', name='concernlabelenum', create_type=False), nullable=False),
        sa.Column('corrected_label', sa.Enum('job_security', 'income', 'social_perception', 'safety', 'degree_foreclosure', name='concernlabelenum', create_type=False), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['concern_id'], ['concerns.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # Create preferences table
    op.create_table(
        'preferences',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('session_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('role', sa.Enum('student', 'parent', 'system', name='speakerroleenum', create_type=False), nullable=False),
        sa.Column('preferred_pathway', sa.Text(), nullable=False),
        sa.Column('priorities', postgresql.ARRAY(sa.Text()), nullable=False, server_default='{}'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['session_id'], ['sessions.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # Create evidence_shown table
    op.create_table(
        'evidence_shown',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('session_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('record_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('shown_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('geography_level_shown', sa.Text(), nullable=False),
        sa.Column('helpful_feedback', sa.Boolean(), nullable=True),
        sa.ForeignKeyConstraint(['record_id'], ['knowledge_records.id'], ondelete='RESTRICT'),
        sa.ForeignKeyConstraint(['session_id'], ['sessions.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # Create summaries table
    op.create_table(
        'summaries',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('session_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('content', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column('readiness', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column('generated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['session_id'], ['sessions.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # Create counsellors table
    op.create_table(
        'counsellors',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('display_name', sa.Text(), nullable=False),
        sa.Column('languages', postgresql.ARRAY(sa.Text()), nullable=False, server_default='{}'),
        sa.Column('region', sa.Text(), nullable=False),
        sa.Column('active', sa.Boolean(), nullable=False, server_default='true'),
        sa.PrimaryKeyConstraint('id')
    )

    # Create handoffs table
    op.create_table(
        'handoffs',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('session_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('counsellor_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('reason', sa.Enum('outside_knowledge', 'repeated_confusion', 'distress', 'unresolved_disagreement', 'requested', 'evidence_conflict', 'case_specific', name='handoffreasonenum', create_type=False), nullable=False),
        sa.Column('package', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column('status', sa.Enum('pending', 'accepted', 'completed', name='handoffstatusenum', create_type=False), nullable=False, server_default='pending'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('consent_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.ForeignKeyConstraint(['consent_id'], ['consents.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['counsellor_id'], ['counsellors.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['session_id'], ['sessions.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # Create audit_log table
    op.create_table(
        'audit_log',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('actor_role', sa.Text(), nullable=False),
        sa.Column('action', sa.Text(), nullable=False),
        sa.Column('entity', sa.Text(), nullable=False),
        sa.Column('entity_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('timestamp', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    # Drop tables in reverse order
    op.drop_table('audit_log')
    op.drop_table('handoffs')
    op.drop_table('counsellors')
    op.drop_table('summaries')
    op.drop_table('evidence_shown')
    op.drop_table('preferences')
    op.drop_table('concern_corrections')
    op.drop_table('concerns')
    op.drop_table('messages')
    op.drop_table('consents')
    op.drop_table('sessions')
    op.drop_table('progression_edges')
    op.drop_table('knowledge_records')
    op.drop_table('sources')

    # Drop enum types
    enum_names = [
        'handoffstatusenum', 'handoffreasonenum', 'concernstatusenum', 'concernlabelenum',
        'safetyflagenum', 'speakerroleenum', 'consentmethodenum', 'consenterroleenum',
        'consentkindenum', 'sessionstatusenum', 'recordstatusenum', 'geographylevelenum',
        'knowledgetopicenum', 'sourcetypeenum'
    ]
    for enum_name in enum_names:
        op.execute(f'DROP TYPE IF EXISTS {enum_name}')